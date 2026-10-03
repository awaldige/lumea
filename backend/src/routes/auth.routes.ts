import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import prisma from "../lib/prisma.js";
import { exigirAutenticacao } from "../middleware/auth.middleware.js";

const router = Router();

const JWT_SECRET: string = process.env.JWT_SECRET ?? "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não configurado no ambiente.");
}

// =========================
// FUNÇÕES AUXILIARES
// =========================

function gerarToken(usuarioId: number) {
  return jwt.sign(
    {
      sub: usuarioId,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

function gerarTokenRecuperacao() {
  return crypto.randomBytes(32).toString("hex");
}

function gerarHashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function senhaValida(senha: unknown) {
  return typeof senha === "string" && senha.length >= 6;
}

// =========================
// POST /api/auth/cadastro
// =========================

router.post("/cadastro", async (req, res) => {
  try {
    const {
      nome,
      nomeUsuario,
      email,
      telefone,
      senha,
      cep,
      estado,
      endereco,
      numero,
      complemento,
      cidade,
    } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Nome, e-mail e senha são obrigatórios.",
      });
    }

    if (!senhaValida(senha)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "A senha deve ter pelo menos 6 caracteres.",
      });
    }

    if (!cep || !estado || !endereco || !numero || !cidade) {
      return res.status(400).json({
        sucesso: false,
        mensagem:
          "CEP, estado, endereço, número e cidade são obrigatórios.",
      });
    }

    const emailNormalizado = String(email).trim().toLowerCase();

    const nomeUsuarioNormalizado = nomeUsuario
      ? String(nomeUsuario).trim().toLowerCase()
      : null;

    if (
      nomeUsuarioNormalizado &&
      !/^[a-z0-9._-]+$/.test(nomeUsuarioNormalizado)
    ) {
      return res.status(400).json({
        sucesso: false,
        mensagem:
          "O nome de usuário deve conter apenas letras, números, ponto, hífen ou sublinhado.",
      });
    }

    const usuarioPorEmail = await prisma.usuario.findUnique({
      where: {
        email: emailNormalizado,
      },
    });

    if (usuarioPorEmail) {
      return res.status(409).json({
        sucesso: false,
        mensagem: "Já existe uma conta com este e-mail.",
      });
    }

    if (nomeUsuarioNormalizado) {
      const usuarioPorNome = await prisma.usuario.findUnique({
        where: {
          nomeUsuario: nomeUsuarioNormalizado,
        },
      });

      if (usuarioPorNome) {
        return res.status(409).json({
          sucesso: false,
          mensagem: "Este nome de usuário já está em uso.",
        });
      }
    }

    const senhaHash = await bcrypt.hash(String(senha), 12);

    const usuario = await prisma.usuario.create({
      data: {
        nome: String(nome).trim(),
        nomeUsuario: nomeUsuarioNormalizado,
        email: emailNormalizado,
        telefone: telefone ? String(telefone).trim() : null,
        cep: String(cep).trim(),
        estado: String(estado).trim(),
        endereco: String(endereco).trim(),
        numero: String(numero).trim(),
        complemento: complemento
          ? String(complemento).trim()
          : null,
        cidade: String(cidade).trim(),
        senhaHash,
      },
      select: {
        id: true,
        nome: true,
        nomeUsuario: true,
        email: true,
        telefone: true,
        cep: true,
        estado: true,
        endereco: true,
        numero: true,
        complemento: true,
        cidade: true,
        perfil: true,
        ativo: true,
        criadoEm: true,
      },
    });

    const token = gerarToken(usuario.id);

    return res.status(201).json({
      sucesso: true,
      mensagem: "Conta criada com sucesso.",
      token,
      usuario,
    });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao criar a conta.",
    });
  }
});

// =========================
// POST /api/auth/login
// =========================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      nomeUsuario,
      identificador,
      senha,
    } = req.body;

    const login = identificador ?? email ?? nomeUsuario;

    if (!login || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem:
          "E-mail ou nome de usuário e senha são obrigatórios.",
      });
    }

    const identificadorNormalizado = String(login)
      .trim()
      .toLowerCase();

    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          {
            email: identificadorNormalizado,
          },
          {
            nomeUsuario: identificadorNormalizado,
          },
        ],
      },
    });

    if (!usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem:
          "E-mail, nome de usuário ou senha inválidos.",
      });
    }

    if (!usuario.ativo) {
      return res.status(403).json({
        sucesso: false,
        mensagem: "Esta conta está inativa.",
      });
    }

    const senhaValidaUsuario = await bcrypt.compare(
      String(senha),
      usuario.senhaHash
    );

    if (!senhaValidaUsuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem:
          "E-mail, nome de usuário ou senha inválidos.",
      });
    }

    const token = gerarToken(usuario.id);

    return res.json({
      sucesso: true,
      mensagem: "Login realizado com sucesso.",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        nomeUsuario: usuario.nomeUsuario,
        email: usuario.email,
        telefone: usuario.telefone,
        cep: usuario.cep,
        estado: usuario.estado,
        endereco: usuario.endereco,
        numero: usuario.numero,
        complemento: usuario.complemento,
        cidade: usuario.cidade,
        perfil: usuario.perfil,
        ativo: usuario.ativo,
      },
    });
  } catch (error) {
    console.error("Erro ao realizar login:", error);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao realizar login.",
    });
  }
});

// =========================
// POST /api/auth/alterar-senha
// =========================

router.post(
  "/alterar-senha",
  exigirAutenticacao,
  async (req, res) => {
    try {
      const {
        senhaAtual,
        novaSenha,
      } = req.body;

      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Senha atual e nova senha são obrigatórias.",
        });
      }

      if (!senhaValida(novaSenha)) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "A nova senha deve ter pelo menos 6 caracteres.",
        });
      }

      if (String(senhaAtual) === String(novaSenha)) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "A nova senha deve ser diferente da senha atual.",
        });
      }

      const usuario = await prisma.usuario.findUnique({
        where: {
          id: req.usuario!.id,
        },
      });

      if (!usuario || !usuario.ativo) {
        return res.status(401).json({
          sucesso: false,
          mensagem:
            "Usuário não encontrado ou inativo.",
        });
      }

      const senhaAtualValida = await bcrypt.compare(
        String(senhaAtual),
        usuario.senhaHash
      );

      if (!senhaAtualValida) {
        return res.status(401).json({
          sucesso: false,
          mensagem: "A senha atual está incorreta.",
        });
      }

      const novaSenhaHash = await bcrypt.hash(
        String(novaSenha),
        12
      );

      await prisma.usuario.update({
        where: {
          id: usuario.id,
        },
        data: {
          senhaHash: novaSenhaHash,
        },
      });

      return res.json({
        sucesso: true,
        mensagem: "Senha alterada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao alterar senha:", error);

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao alterar a senha.",
      });
    }
  }
);

// =========================
// POST /api/auth/esqueci-senha
// =========================

router.post(
  "/esqueci-senha",
  async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Informe o e-mail da conta.",
        });
      }

      const emailNormalizado = String(email)
        .trim()
        .toLowerCase();

      const usuario = await prisma.usuario.findUnique({
        where: {
          email: emailNormalizado,
        },
      });

      if (!usuario || !usuario.ativo) {
        return res.json({
          sucesso: true,
          mensagem:
            "Se existir uma conta com este e-mail, as instruções de recuperação serão disponibilizadas.",
        });
      }

      await prisma.tokenRecuperacaoSenha.deleteMany({
        where: {
          usuarioId: usuario.id,
          usadoEm: null,
        },
      });

      const token = gerarTokenRecuperacao();
      const tokenHash = gerarHashToken(token);

      const expiraEm = new Date(
        Date.now() + 60 * 60 * 1000
      );

      await prisma.tokenRecuperacaoSenha.create({
        data: {
          tokenHash,
          usuarioId: usuario.id,
          expiraEm,
        },
      });

      const frontendUrl =
        process.env.FRONTEND_URL ??
        "http://localhost:3000";

      const linkRecuperacao =
        `${frontendUrl}/admin/redefinir-senha?token=${token}`;

      const resposta: {
        sucesso: boolean;
        mensagem: string;
        linkRecuperacao?: string;
      } = {
        sucesso: true,
        mensagem:
          "Se existir uma conta com este e-mail, as instruções de recuperação serão disponibilizadas.",
      };

      if (process.env.NODE_ENV !== "production") {
        resposta.linkRecuperacao =
          linkRecuperacao;

        console.log(
          "Link de recuperação de senha:",
          linkRecuperacao
        );
      }

      return res.json(resposta);
    } catch (error) {
      console.error(
        "Erro ao solicitar recuperação:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao solicitar recuperação de senha.",
      });
    }
  }
);

// =========================
// POST /api/auth/redefinir-senha
// =========================

router.post(
  "/redefinir-senha",
  async (req, res) => {
    try {
      const {
        token,
        novaSenha,
      } = req.body;

      if (!token || !novaSenha) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Token e nova senha são obrigatórios.",
        });
      }

      if (!senhaValida(novaSenha)) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "A nova senha deve ter pelo menos 6 caracteres.",
        });
      }

      const tokenHash = gerarHashToken(
        String(token)
      );

      const registro =
        await prisma.tokenRecuperacaoSenha.findUnique({
          where: {
            tokenHash,
          },
          include: {
            usuario: true,
          },
        });

      if (!registro) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Token de recuperação inválido.",
        });
      }

      if (registro.usadoEm) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Este token de recuperação já foi utilizado.",
        });
      }

      if (
        registro.expiraEm.getTime() <
        Date.now()
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Este token de recuperação expirou.",
        });
      }

      if (!registro.usuario.ativo) {
        return res.status(403).json({
          sucesso: false,
          mensagem:
            "Esta conta está inativa.",
        });
      }

      const novaSenhaHash =
        await bcrypt.hash(
          String(novaSenha),
          12
        );

      await prisma.$transaction([
        prisma.usuario.update({
          where: {
            id: registro.usuarioId,
          },
          data: {
            senhaHash: novaSenhaHash,
          },
        }),

        prisma.tokenRecuperacaoSenha.update({
          where: {
            id: registro.id,
          },
          data: {
            usadoEm: new Date(),
          },
        }),

        prisma.tokenRecuperacaoSenha.deleteMany({
          where: {
            usuarioId: registro.usuarioId,
            id: {
              not: registro.id,
            },
            usadoEm: null,
          },
        }),
      ]);

      return res.json({
        sucesso: true,
        mensagem:
          "Senha redefinida com sucesso.",
      });
    } catch (error) {
      console.error(
        "Erro ao redefinir senha:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao redefinir senha.",
      });
    }
  }
);

// =========================
// PUT /api/auth/me
// Atualiza o próprio usuário
// =========================

router.put(
  "/me",
  exigirAutenticacao,
  async (req, res) => {
    try {
      const {
        nome,
        nomeUsuario,
        email,
      } = req.body;

      if (!nome || !nomeUsuario || !email) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Nome, nome de usuário e e-mail são obrigatórios.",
        });
      }

      const usuario = await prisma.usuario.findUnique({
        where: {
          id: req.usuario!.id,
        },
      });

      if (!usuario || !usuario.ativo) {
        return res.status(401).json({
          sucesso: false,
          mensagem:
            "Usuário não encontrado ou inativo.",
        });
      }

      const nomeNormalizado = String(nome).trim();

      const nomeUsuarioNormalizado = String(
        nomeUsuario
      )
        .trim()
        .toLowerCase();

      const emailNormalizado = String(email)
        .trim()
        .toLowerCase();

      if (
        !nomeNormalizado ||
        !nomeUsuarioNormalizado ||
        !emailNormalizado
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Preencha todos os campos obrigatórios.",
        });
      }

      if (
        !/^[a-z0-9._-]+$/.test(
          nomeUsuarioNormalizado
        )
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "O nome de usuário deve conter apenas letras, números, ponto, hífen ou sublinhado.",
        });
      }

      // Verifica se outro usuário já utiliza o e-mail
      const usuarioComEmail =
        await prisma.usuario.findFirst({
          where: {
            email: emailNormalizado,
            id: {
              not: usuario.id,
            },
          },
        });

      if (usuarioComEmail) {
        return res.status(409).json({
          sucesso: false,
          mensagem:
            "Este e-mail já está sendo utilizado por outra conta.",
        });
      }

      // Verifica se outro usuário já utiliza o nome de usuário
      const usuarioComNome =
        await prisma.usuario.findFirst({
          where: {
            nomeUsuario: nomeUsuarioNormalizado,
            id: {
              not: usuario.id,
            },
          },
        });

      if (usuarioComNome) {
        return res.status(409).json({
          sucesso: false,
          mensagem:
            "Este nome de usuário já está sendo utilizado.",
        });
      }

      // Atualiza somente os três dados editáveis.
      // Telefone, endereço, CEP, cidade etc.
      // permanecem exatamente como estão no banco.
      const usuarioAtualizado =
        await prisma.usuario.update({
          where: {
            id: usuario.id,
          },
          data: {
            nome: nomeNormalizado,
            nomeUsuario: nomeUsuarioNormalizado,
            email: emailNormalizado,
          },
          select: {
            id: true,
            nome: true,
            nomeUsuario: true,
            email: true,
            telefone: true,
            cep: true,
            estado: true,
            endereco: true,
            numero: true,
            complemento: true,
            cidade: true,
            perfil: true,
            ativo: true,
            criadoEm: true,
          },
        });

      return res.json({
        sucesso: true,
        mensagem:
          "Dados atualizados com sucesso.",
        usuario: usuarioAtualizado,
      });
    } catch (error) {
      console.error(
        "Erro ao atualizar dados do usuário:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao atualizar os dados da conta.",
      });
    }
  }
);
// =========================
// GET /api/auth/me
// =========================

router.get("/me", async (req, res) => {
  try {
    const authorization =
      req.headers.authorization;

    if (
      !authorization?.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "Token não informado.",
      });
    }

    const token = authorization.substring(7);

    const payload = jwt.verify(
      token,
      JWT_SECRET
    );

    if (
      typeof payload !== "object" ||
      payload === null ||
      !payload.sub
    ) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "Token inválido.",
      });
    }

    const usuarioId = Number(payload.sub);

    if (!Number.isInteger(usuarioId)) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "Token inválido.",
      });
    }

    const usuario =
      await prisma.usuario.findUnique({
        where: {
          id: usuarioId,
        },
        select: {
          id: true,
          nome: true,
          nomeUsuario: true,
          email: true,
          telefone: true,
          cep: true,
          estado: true,
          endereco: true,
          numero: true,
          complemento: true,
          cidade: true,
          perfil: true,
          ativo: true,
          criadoEm: true,
        },
      });

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({
        sucesso: false,
        mensagem:
          "Usuário não encontrado ou inativo.",
      });
    }

    return res.json({
      sucesso: true,
      usuario,
    });
  } catch (error) {
    console.error(
      "Erro ao verificar sessão:",
      error
    );

    return res.status(401).json({
      sucesso: false,
      mensagem:
        "Sessão inválida ou expirada.",
    });
  }
});

export default router;
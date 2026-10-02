import { Router } from "express";

import prisma from "../lib/prisma.js";
import {
  exigirAdmin,
  exigirAutenticacao,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// LISTAR COLEÇÕES PÚBLICAS
// =========================

router.get("/", async (_req, res) => {
  try {
    const colecoes = await prisma.colecao.findMany({
      where: {
        ativo: true,
      },

      orderBy: {
        nome: "asc",
      },

      include: {
        produtos: {
          where: {
            ativo: true,
          },

          orderBy: {
            criadoEm: "desc",
          },

          include: {
            categoria: true,
          },
        },
      },
    });

    return res.json(colecoes);
  } catch (error) {
    console.error("Erro ao buscar coleções:", error);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar coleções.",
    });
  }
});

// =========================
// LISTAR COLEÇÕES - ADMIN
// =========================

router.get(
  "/admin",
  exigirAutenticacao,
  exigirAdmin,
  async (_req, res) => {
    try {
      const colecoes = await prisma.colecao.findMany({
        orderBy: {
          nome: "asc",
        },

        include: {
          _count: {
            select: {
              produtos: true,
            },
          },
        },
      });

      return res.json(colecoes);
    } catch (error) {
      console.error(
        "Erro ao buscar coleções administrativas:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao buscar coleções.",
      });
    }
  }
);

// =========================
// CRIAR COLEÇÃO
// =========================

router.post(
  "/",
  exigirAutenticacao,
  exigirAdmin,
  async (req, res) => {
    try {
      const {
        nome,
        slug,
        descricao,
        ativo,
      } = req.body;

      if (
        typeof nome !== "string" ||
        !nome.trim()
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "O nome da coleção é obrigatório.",
        });
      }

      if (
        typeof slug !== "string" ||
        !slug.trim()
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "O slug da coleção é obrigatório.",
        });
      }

      const nomeNormalizado = nome.trim();
      const slugNormalizado = slug
        .trim()
        .toLowerCase();

      const colecaoExistente =
        await prisma.colecao.findFirst({
          where: {
            OR: [
              {
                nome: {
                  equals: nomeNormalizado,
                  mode: "insensitive",
                },
              },
              {
                slug: slugNormalizado,
              },
            ],
          },
        });

      if (colecaoExistente) {
        return res.status(409).json({
          sucesso: false,
          mensagem:
            colecaoExistente.slug ===
            slugNormalizado
              ? "Já existe uma coleção com este slug."
              : "Já existe uma coleção com este nome.",
        });
      }

      const colecao =
        await prisma.colecao.create({
          data: {
            nome: nomeNormalizado,
            slug: slugNormalizado,
            descricao:
              typeof descricao === "string" &&
              descricao.trim()
                ? descricao.trim()
                : null,
            ativo:
              typeof ativo === "boolean"
                ? ativo
                : true,
          },

          include: {
            _count: {
              select: {
                produtos: true,
              },
            },
          },
        });

      return res.status(201).json(colecao);
    } catch (error) {
      console.error(
        "Erro ao criar coleção:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao criar coleção.",
      });
    }
  }
);

// =========================
// ATUALIZAR COLEÇÃO
// =========================

router.put(
  "/:id",
  exigirAutenticacao,
  exigirAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "ID da coleção inválido.",
        });
      }

      const {
        nome,
        slug,
        descricao,
        ativo,
      } = req.body;

      if (
        typeof nome !== "string" ||
        !nome.trim()
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "O nome da coleção é obrigatório.",
        });
      }

      if (
        typeof slug !== "string" ||
        !slug.trim()
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "O slug da coleção é obrigatório.",
        });
      }

      const nomeNormalizado = nome.trim();
      const slugNormalizado = slug
        .trim()
        .toLowerCase();

      const colecao =
        await prisma.colecao.findUnique({
          where: {
            id,
          },
        });

      if (!colecao) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Coleção não encontrada.",
        });
      }

      const colecaoDuplicada =
        await prisma.colecao.findFirst({
          where: {
            AND: [
              {
                id: {
                  not: id,
                },
              },
              {
                OR: [
                  {
                    nome: {
                      equals: nomeNormalizado,
                      mode: "insensitive",
                    },
                  },
                  {
                    slug: slugNormalizado,
                  },
                ],
              },
            ],
          },
        });

      if (colecaoDuplicada) {
        return res.status(409).json({
          sucesso: false,
          mensagem:
            colecaoDuplicada.slug ===
            slugNormalizado
              ? "Já existe outra coleção com este slug."
              : "Já existe outra coleção com este nome.",
        });
      }

      const colecaoAtualizada =
        await prisma.colecao.update({
          where: {
            id,
          },

          data: {
            nome: nomeNormalizado,
            slug: slugNormalizado,
            descricao:
              typeof descricao === "string" &&
              descricao.trim()
                ? descricao.trim()
                : null,
            ativo:
              typeof ativo === "boolean"
                ? ativo
                : colecao.ativo,
          },

          include: {
            _count: {
              select: {
                produtos: true,
              },
            },
          },
        });

      return res.json(colecaoAtualizada);
    } catch (error) {
      console.error(
        "Erro ao atualizar coleção:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao atualizar coleção.",
      });
    }
  }
);

// =========================
// INATIVAR COLEÇÃO
// =========================

router.delete(
  "/:id",
  exigirAutenticacao,
  exigirAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "ID da coleção inválido.",
        });
      }

      const colecao =
        await prisma.colecao.findUnique({
          where: {
            id,
          },

          include: {
            _count: {
              select: {
                produtos: true,
              },
            },
          },
        });

      if (!colecao) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Coleção não encontrada.",
        });
      }

      const colecaoAtualizada =
        await prisma.colecao.update({
          where: {
            id,
          },

          data: {
            ativo: false,
          },

          include: {
            _count: {
              select: {
                produtos: true,
              },
            },
          },
        });

      return res.json({
        sucesso: true,
        mensagem: "Coleção inativada com sucesso.",
        colecao: colecaoAtualizada,
      });
    } catch (error) {
      console.error(
        "Erro ao inativar coleção:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao inativar coleção.",
      });
    }
  }
);

// =========================
// BUSCAR COLEÇÃO POR SLUG
// =========================

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const colecao =
      await prisma.colecao.findFirst({
        where: {
          slug,
          ativo: true,
        },

        include: {
          produtos: {
            where: {
              ativo: true,
            },

            orderBy: {
              criadoEm: "desc",
            },

            include: {
              categoria: true,
            },
          },
        },
      });

    if (!colecao) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Coleção não encontrada.",
      });
    }

    return res.json(colecao);
  } catch (error) {
    console.error(
      "Erro ao buscar coleção:",
      error
    );

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar coleção.",
    });
  }
});

export default router;
import { Router } from "express";
import fs from "fs";
import path from "path";

import prisma from "../lib/prisma.js";

import {
  exigirAdmin,
  exigirAutenticacao,
} from "../middleware/auth.middleware.js";

import { uploadProduto } from "../middleware/upload.middleware.js";

const router = Router();

// =========================
// FUNÇÕES AUXILIARES
// =========================

function converterBooleano(
  valor: unknown,
  valorPadrao: boolean
): boolean {
  if (
    valor === undefined ||
    valor === null ||
    valor === ""
  ) {
    return valorPadrao;
  }

  if (typeof valor === "boolean") {
    return valor;
  }

  if (typeof valor === "string") {
    return valor.toLowerCase() === "true";
  }

  return Boolean(valor);
}

function removerArquivoSeExistir(
  caminhoArquivo: string | null
) {
  if (!caminhoArquivo) {
    return;
  }

  try {
    if (fs.existsSync(caminhoArquivo)) {
      fs.unlinkSync(caminhoArquivo);
    }
  } catch (error) {
    console.error(
      "Erro ao remover arquivo:",
      error
    );
  }
}

function removerImagemLocal(
  imagem: string | null
) {
  if (
    !imagem ||
    !imagem.startsWith("/uploads/")
  ) {
    return;
  }

  const caminhoRelativo = imagem.replace(
    /^\/uploads\//,
    ""
  );

  const caminhoArquivo = path.resolve(
    "uploads",
    caminhoRelativo
  );

  removerArquivoSeExistir(caminhoArquivo);
}

function caminhoArquivoUpload(
  req: {
    file?: Express.Multer.File;
  }
) {
  return req.file?.path || null;
}

// =========================
// GET /api/produtos
// =========================
// Lista somente produtos ativos.
// Uso público.
// =========================

router.get("/", async (req, res) => {
  try {
    const {
      categoria,
      colecao,
      busca,
      ordenacao,
    } = req.query;

    const produtos =
      await prisma.produto.findMany({
        where: {
          ativo: true,

          ...(categoria
            ? {
                categoria: {
                  slug: String(categoria),
                },
              }
            : {}),

          ...(colecao
            ? {
                colecao: {
                  slug: String(colecao),
                },
              }
            : {}),

          ...(busca
            ? {
                OR: [
                  {
                    nome: {
                      contains: String(busca),
                      mode: "insensitive",
                    },
                  },
                  {
                    descricao: {
                      contains: String(busca),
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {}),
        },

        include: {
          categoria: true,
          colecao: true,
        },

        orderBy:
          ordenacao === "menor-preco"
            ? {
                preco: "asc",
              }
            : ordenacao === "maior-preco"
              ? {
                  preco: "desc",
                }
              : {
                  criadoEm: "desc",
                },
      });

    return res.json(produtos);
  } catch (error) {
    console.error(
      "Erro ao buscar produtos:",
      error
    );

    return res.status(500).json({
      sucesso: false,
      mensagem:
        "Erro ao buscar produtos.",
    });
  }
});

// =========================
// GET /api/produtos/admin/:id
// =========================
// Busca produto para o painel administrativo.
// Permite buscar inclusive produto inativo.
// Somente ADMIN.
// =========================

router.get(
  "/admin/:id",
  exigirAutenticacao,
  exigirAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "ID do produto inválido.",
        });
      }

      const produto =
        await prisma.produto.findUnique({
          where: {
            id,
          },

          include: {
            categoria: true,
            colecao: true,
          },
        });

      if (!produto) {
        return res.status(404).json({
          sucesso: false,
          mensagem:
            "Produto não encontrado.",
        });
      }

      return res.json(produto);
    } catch (error) {
      console.error(
        "Erro ao buscar produto administrativo:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao buscar produto.",
      });
    }
  }
);

// =========================
// GET /api/produtos/:id
// =========================
// Busca produto público.
// Somente produtos ativos.
// =========================

router.get(
  "/:id",
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "ID do produto inválido.",
        });
      }

      const produto =
        await prisma.produto.findFirst({
          where: {
            id,
            ativo: true,
          },

          include: {
            categoria: true,
            colecao: true,
          },
        });

      if (!produto) {
        return res.status(404).json({
          sucesso: false,
          mensagem:
            "Produto não encontrado.",
        });
      }

      return res.json(produto);
    } catch (error) {
      console.error(
        "Erro ao buscar produto:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao buscar produto.",
      });
    }
  }
);

// =========================
// POST /api/produtos
// =========================
// Cria produto.
// Somente ADMIN.
// Campo do arquivo: imagem
// =========================

router.post(
  "/",
  exigirAutenticacao,
  exigirAdmin,
  uploadProduto.single("imagem"),
  async (req, res) => {
    let arquivoCriado: string | null =
      caminhoArquivoUpload(req);

    try {
      const {
        nome,
        slug,
        descricao,
        preco,
        precoOferta,
        estoque,
        categoriaId,
        colecaoId,
        ativo,
        destaque,
        novo,
        oferta,
      } = req.body;

      // =========================
      // VALIDAÇÕES BÁSICAS
      // =========================

      if (
        !nome ||
        !slug ||
        !descricao ||
        preco === undefined ||
        categoriaId === undefined
      ) {
        removerArquivoSeExistir(
          arquivoCriado
        );

        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Nome, slug, descrição, preço e categoria são obrigatórios.",
        });
      }

      // =========================
      // PREÇO
      // =========================

      const precoNumero = Number(preco);

      if (
        !Number.isFinite(precoNumero) ||
        precoNumero < 0
      ) {
        removerArquivoSeExistir(
          arquivoCriado
        );

        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Preço inválido.",
        });
      }

      // =========================
      // PREÇO DE OFERTA
      // =========================

      let precoOfertaNumero:
        | number
        | null = null;

      if (
        precoOferta !== undefined &&
        precoOferta !== null &&
        precoOferta !== ""
      ) {
        precoOfertaNumero =
          Number(precoOferta);

        if (
          !Number.isFinite(
            precoOfertaNumero
          ) ||
          precoOfertaNumero < 0
        ) {
          removerArquivoSeExistir(
            arquivoCriado
          );

          return res.status(400).json({
            sucesso: false,
            mensagem:
              "Preço promocional inválido.",
          });
        }
      }

      // =========================
      // ESTOQUE
      // =========================

      const estoqueNumero =
        estoque === undefined ||
        estoque === ""
          ? 0
          : Number(estoque);

      if (
        !Number.isInteger(
          estoqueNumero
        ) ||
        estoqueNumero < 0
      ) {
        removerArquivoSeExistir(
          arquivoCriado
        );

        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Estoque inválido.",
        });
      }

      // =========================
      // CATEGORIA
      // =========================

      const categoriaIdNumero =
        Number(categoriaId);

      if (
        !Number.isInteger(
          categoriaIdNumero
        )
      ) {
        removerArquivoSeExistir(
          arquivoCriado
        );

        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Categoria inválida.",
        });
      }

      const categoria =
        await prisma.categoria.findUnique({
          where: {
            id: categoriaIdNumero,
          },
        });

      if (!categoria) {
        removerArquivoSeExistir(
          arquivoCriado
        );

        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Categoria não encontrada.",
        });
      }

      // =========================
      // COLEÇÃO
      // =========================

      let colecaoIdNumero:
        | number
        | null = null;

      if (
        colecaoId !== undefined &&
        colecaoId !== null &&
        colecaoId !== ""
      ) {
        colecaoIdNumero =
          Number(colecaoId);

        if (
          !Number.isInteger(
            colecaoIdNumero
          )
        ) {
          removerArquivoSeExistir(
            arquivoCriado
          );

          return res.status(400).json({
            sucesso: false,
            mensagem:
              "Coleção inválida.",
          });
        }

        const colecao =
          await prisma.colecao.findUnique({
            where: {
              id: colecaoIdNumero,
            },
          });

        if (!colecao) {
          removerArquivoSeExistir(
            arquivoCriado
          );

          return res.status(400).json({
            sucesso: false,
            mensagem:
              "Coleção não encontrada.",
          });
        }
      }

      // =========================
      // SLUG
      // =========================

      const slugLimpo =
        String(slug).trim();

      if (!slugLimpo) {
        removerArquivoSeExistir(
          arquivoCriado
        );

        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Slug é obrigatório.",
        });
      }

      const slugExistente =
        await prisma.produto.findUnique({
          where: {
            slug: slugLimpo,
          },
        });

      if (slugExistente) {
        removerArquivoSeExistir(
          arquivoCriado
        );

        return res.status(409).json({
          sucesso: false,
          mensagem:
            "Já existe um produto com este slug.",
        });
      }

      // =========================
      // IMAGEM
      // =========================

      let imagem: string | null =
        null;

      if (req.file) {
        imagem =
          `/uploads/produtos/${req.file.filename}`;
      }

      // =========================
      // CRIAR PRODUTO
      // =========================

      const produto =
        await prisma.produto.create({
          data: {
            nome: String(nome).trim(),

            slug: slugLimpo,

            descricao:
              String(descricao).trim(),

            preco: precoNumero,

            precoOferta:
              precoOfertaNumero,

            estoque: estoqueNumero,

            ativo: converterBooleano(
              ativo,
              true
            ),

            destaque: converterBooleano(
              destaque,
              false
            ),

            novo: converterBooleano(
              novo,
              false
            ),

            oferta: converterBooleano(
              oferta,
              false
            ),

            imagem,

            categoriaId:
              categoriaIdNumero,

            colecaoId:
              colecaoIdNumero,
          },

          include: {
            categoria: true,
            colecao: true,
          },
        });

      // O arquivo agora pertence ao produto.
      arquivoCriado = null;

      return res.status(201).json({
        sucesso: true,
        mensagem:
          "Produto criado com sucesso.",
        produto,
      });
    } catch (error) {
      console.error(
        "Erro ao criar produto:",
        error
      );

      removerArquivoSeExistir(
        arquivoCriado
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao criar produto.",
      });
    }
  }
);

// =========================
// PUT /api/produtos/:id
// =========================
// Atualiza produto.
// Somente ADMIN.
// Campo opcional do arquivo: imagem
//
// Se uma nova imagem for enviada:
// - salva a nova imagem;
// - atualiza o produto;
// - remove a imagem antiga.
//
// Se nenhuma imagem for enviada:
// - mantém a imagem atual.
// =========================

router.put(
  "/:id",
  exigirAutenticacao,
  exigirAdmin,
  uploadProduto.single("imagem"),
  async (req, res) => {
    let arquivoCriado: string | null =
      caminhoArquivoUpload(req);

    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        removerArquivoSeExistir(
          arquivoCriado
        );

        return res.status(400).json({
          sucesso: false,
          mensagem:
            "ID do produto inválido.",
        });
      }

      // =========================
      // PRODUTO EXISTENTE
      // =========================

      const produtoExistente =
        await prisma.produto.findUnique({
          where: {
            id,
          },
        });

      if (!produtoExistente) {
        removerArquivoSeExistir(
          arquivoCriado
        );

        return res.status(404).json({
          sucesso: false,
          mensagem:
            "Produto não encontrado.",
        });
      }

      const {
        nome,
        slug,
        descricao,
        preco,
        precoOferta,
        estoque,
        categoriaId,
        colecaoId,
        ativo,
        destaque,
        novo,
        oferta,
      } = req.body;

      // =========================
      // VALIDAÇÕES BÁSICAS
      // =========================

      if (
        !nome ||
        !slug ||
        !descricao
      ) {
        removerArquivoSeExistir(
          arquivoCriado
        );

        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Nome, slug e descrição são obrigatórios.",
        });
      }

      // =========================
      // PREÇO
      // =========================

      const precoNumero =
        Number(preco);

      if (
        !Number.isFinite(
          precoNumero
        ) ||
        precoNumero < 0
      ) {
        removerArquivoSeExistir(
          arquivoCriado
        );

        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Preço inválido.",
        });
      }

      // =========================
      // PREÇO DE OFERTA
      // =========================

      let precoOfertaNumero:
        | number
        | null = null;

      if (
        precoOferta !== undefined &&
        precoOferta !== null &&
        precoOferta !== ""
      ) {
        precoOfertaNumero =
          Number(precoOferta);

        if (
          !Number.isFinite(
            precoOfertaNumero
          ) ||
          precoOfertaNumero < 0
        ) {
          removerArquivoSeExistir(
            arquivoCriado
          );

          return res.status(400).json({
            sucesso: false,
            mensagem:
              "Preço promocional inválido.",
          });
        }
      }

      // =========================
      // ESTOQUE
      // =========================

      const estoqueNumero =
        Number(estoque);

      if (
        !Number.isInteger(
          estoqueNumero
        ) ||
        estoqueNumero < 0
      ) {
        removerArquivoSeExistir(
          arquivoCriado
        );

        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Estoque inválido.",
        });
      }

      // =========================
      // CATEGORIA
      // =========================

      const categoriaIdNumero =
        Number(categoriaId);

      if (
        !Number.isInteger(
          categoriaIdNumero
        )
      ) {
        removerArquivoSeExistir(
          arquivoCriado
        );

        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Categoria inválida.",
        });
      }

      const categoria =
        await prisma.categoria.findUnique({
          where: {
            id: categoriaIdNumero,
          },
        });

      if (!categoria) {
        removerArquivoSeExistir(
          arquivoCriado
        );

        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Categoria não encontrada.",
        });
      }

      // =========================
      // COLEÇÃO
      // =========================

      let colecaoIdNumero:
        | number
        | null = null;

      if (
        colecaoId !== undefined &&
        colecaoId !== null &&
        colecaoId !== ""
      ) {
        colecaoIdNumero =
          Number(colecaoId);

        if (
          !Number.isInteger(
            colecaoIdNumero
          )
        ) {
          removerArquivoSeExistir(
            arquivoCriado
          );

          return res.status(400).json({
            sucesso: false,
            mensagem:
              "Coleção inválida.",
          });
        }

        const colecao =
          await prisma.colecao.findUnique({
            where: {
              id: colecaoIdNumero,
            },
          });

        if (!colecao) {
          removerArquivoSeExistir(
            arquivoCriado
          );

          return res.status(400).json({
            sucesso: false,
            mensagem:
              "Coleção não encontrada.",
          });
        }
      }

      // =========================
      // SLUG
      // =========================

      const slugLimpo =
        String(slug).trim();

      if (!slugLimpo) {
        removerArquivoSeExistir(
          arquivoCriado
        );

        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Slug é obrigatório.",
        });
      }

      const slugExistente =
        await prisma.produto.findFirst({
          where: {
            slug: slugLimpo,

            NOT: {
              id,
            },
          },
        });

      if (slugExistente) {
        removerArquivoSeExistir(
          arquivoCriado
        );

        return res.status(409).json({
          sucesso: false,
          mensagem:
            "Já existe outro produto com este slug.",
        });
      }

      // =========================
      // IMAGEM
      // =========================

      let imagem =
        produtoExistente.imagem;

      const imagemAntiga =
        produtoExistente.imagem;

      if (req.file) {
        imagem =
          `/uploads/produtos/${req.file.filename}`;
      }

      // =========================
      // ATUALIZAR PRODUTO
      // =========================

      const produto =
        await prisma.produto.update({
          where: {
            id,
          },

          data: {
            nome:
              String(nome).trim(),

            slug: slugLimpo,

            descricao:
              String(descricao).trim(),

            preco: precoNumero,

            precoOferta:
              precoOfertaNumero,

            estoque: estoqueNumero,

            ativo: converterBooleano(
              ativo,
              produtoExistente.ativo
            ),

            destaque:
              converterBooleano(
                destaque,
                produtoExistente.destaque
              ),

            novo:
              converterBooleano(
                novo,
                produtoExistente.novo
              ),

            oferta:
              converterBooleano(
                oferta,
                produtoExistente.oferta
              ),

            imagem,

            categoriaId:
              categoriaIdNumero,

            colecaoId:
              colecaoIdNumero,
          },

          include: {
            categoria: true,
            colecao: true,
          },
        });

      // O arquivo agora pertence ao produto.
      arquivoCriado = null;

      // =========================
      // REMOVER IMAGEM ANTIGA
      // =========================

      if (
        req.file &&
        imagemAntiga &&
        imagemAntiga !== imagem
      ) {
        removerImagemLocal(
          imagemAntiga
        );
      }

      return res.json({
        sucesso: true,
        mensagem:
          "Produto atualizado com sucesso.",
        produto,
      });
    } catch (error) {
      console.error(
        "Erro ao atualizar produto:",
        error
      );

      // Se a atualização falhou,
      // removemos somente a nova imagem
      // que acabou de ser enviada.
      removerArquivoSeExistir(
        arquivoCriado
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao atualizar produto.",
      });
    }
  }
);

// =========================
// DELETE /api/produtos/:id
// =========================
// Exclusão lógica.
// Somente ADMIN.
//
// O produto não é removido fisicamente
// do banco de dados.
// =========================

router.delete(
  "/:id",
  exigirAutenticacao,
  exigirAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "ID do produto inválido.",
        });
      }

      const produto =
        await prisma.produto.findUnique({
          where: {
            id,
          },
        });

      if (!produto) {
        return res.status(404).json({
          sucesso: false,
          mensagem:
            "Produto não encontrado.",
        });
      }

      if (!produto.ativo) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "O produto já está inativo.",
        });
      }

      await prisma.produto.update({
        where: {
          id,
        },

        data: {
          ativo: false,
        },
      });

      return res.json({
        sucesso: true,
        mensagem:
          "Produto excluído com sucesso.",
      });
    } catch (error) {
      console.error(
        "Erro ao excluir produto:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao excluir produto.",
      });
    }
  }
);

export default router;
import { Router } from "express";

import prisma from "../lib/prisma.js";

import {
  exigirAdmin,
  exigirAutenticacao,
} from "../middleware/auth.middleware.js";

const router = Router();

/**
 * GET público
 *
 * Retorna somente categorias ativas.
 */
router.get("/", async (_req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      where: {
        ativo: true,
      },

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

    return res.json(categorias);
  } catch (error) {
    console.error(
      "Erro ao buscar categorias:",
      error
    );

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar categorias.",
    });
  }
});

/**
 * GET administrativo
 *
 * Retorna categorias ativas e inativas.
 */
router.get(
  "/admin",
  exigirAutenticacao,
  exigirAdmin,
  async (_req, res) => {
    try {
      const categorias =
        await prisma.categoria.findMany({
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

      return res.json(categorias);
    } catch (error) {
      console.error(
        "Erro ao buscar categorias administrativas:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao buscar categorias.",
      });
    }
  }
);

/**
 * POST
 *
 * Cria uma nova categoria.
 */
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

      if (!nome || !String(nome).trim()) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "O nome da categoria é obrigatório.",
        });
      }

      if (!slug || !String(slug).trim()) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "O slug da categoria é obrigatório.",
        });
      }

      const nomeLimpo =
        String(nome).trim();

      const slugLimpo =
        String(slug).trim().toLowerCase();

      const categoriaExistente =
        await prisma.categoria.findFirst({
          where: {
            OR: [
              {
                nome: {
                  equals: nomeLimpo,
                  mode: "insensitive",
                },
              },
              {
                slug: slugLimpo,
              },
            ],
          },
        });

      if (categoriaExistente) {
        return res.status(409).json({
          sucesso: false,
          mensagem:
            "Já existe uma categoria com este nome ou slug.",
        });
      }

      const categoria =
        await prisma.categoria.create({
          data: {
            nome: nomeLimpo,

            slug: slugLimpo,

            descricao:
              descricao === undefined ||
              descricao === null ||
              String(descricao).trim() === ""
                ? null
                : String(descricao).trim(),

            ativo:
              ativo === undefined
                ? true
                : ativo === true ||
                  ativo === "true",
          },

          include: {
            _count: {
              select: {
                produtos: true,
              },
            },
          },
        });

      return res.status(201).json({
        sucesso: true,
        mensagem:
          "Categoria criada com sucesso.",
        categoria,
      });
    } catch (error) {
      console.error(
        "Erro ao criar categoria:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao criar categoria.",
      });
    }
  }
);

/**
 * PUT
 *
 * Atualiza uma categoria.
 */
router.put(
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
            "ID da categoria inválido.",
        });
      }

      const categoriaExistente =
        await prisma.categoria.findUnique({
          where: {
            id,
          },
        });

      if (!categoriaExistente) {
        return res.status(404).json({
          sucesso: false,
          mensagem:
            "Categoria não encontrada.",
        });
      }

      const {
        nome,
        slug,
        descricao,
        ativo,
      } = req.body;

      if (!nome || !String(nome).trim()) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "O nome da categoria é obrigatório.",
        });
      }

      if (!slug || !String(slug).trim()) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "O slug da categoria é obrigatório.",
        });
      }

      const nomeLimpo =
        String(nome).trim();

      const slugLimpo =
        String(slug).trim().toLowerCase();

      const categoriaDuplicada =
        await prisma.categoria.findFirst({
          where: {
            OR: [
              {
                nome: {
                  equals: nomeLimpo,
                  mode: "insensitive",
                },
              },
              {
                slug: slugLimpo,
              },
            ],

            NOT: {
              id,
            },
          },
        });

      if (categoriaDuplicada) {
        return res.status(409).json({
          sucesso: false,
          mensagem:
            "Já existe outra categoria com este nome ou slug.",
        });
      }

      const categoria =
        await prisma.categoria.update({
          where: {
            id,
          },

          data: {
            nome: nomeLimpo,

            slug: slugLimpo,

            descricao:
              descricao === undefined ||
              descricao === null ||
              String(descricao).trim() === ""
                ? null
                : String(descricao).trim(),

            ativo:
              ativo === undefined
                ? categoriaExistente.ativo
                : ativo === true ||
                  ativo === "true",
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
        mensagem:
          "Categoria atualizada com sucesso.",
        categoria,
      });
    } catch (error) {
      console.error(
        "Erro ao atualizar categoria:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao atualizar categoria.",
      });
    }
  }
);

/**
 * DELETE
 *
 * Exclusão lógica.
 */
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
            "ID da categoria inválido.",
        });
      }

      const categoria =
        await prisma.categoria.findUnique({
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

      if (!categoria) {
        return res.status(404).json({
          sucesso: false,
          mensagem:
            "Categoria não encontrada.",
        });
      }

      if (!categoria.ativo) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "A categoria já está inativa.",
        });
      }

      await prisma.categoria.update({
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
          "Categoria inativada com sucesso.",
      });
    } catch (error) {
      console.error(
        "Erro ao inativar categoria:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao inativar categoria.",
      });
    }
  }
);

export default router;
import { Router } from "express";

import prisma from "../lib/prisma.js";

import {
  exigirAutenticacao,
  exigirAdmin,
} from "../middleware/auth.middleware.js";

const router = Router();

// ======================================================
// GET /api/pedidos/admin
// LISTAR TODOS OS PEDIDOS
// ======================================================

router.get(
  "/admin",
  exigirAutenticacao,
  exigirAdmin,
  async (_req, res) => {
    try {
      const pedidos = await prisma.pedido.findMany({
        orderBy: {
          criadoEm: "desc",
        },

        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
              telefone: true,
              perfil: true,
            },
          },

          itens: {
            include: {
              produto: {
                select: {
                  id: true,
                  nome: true,
                  imagem: true,
                  preco: true,
                },
              },
            },
          },
        },
      });

      // ==================================================
      // DIAGNÓSTICO DOS PEDIDOS E CLIENTES
      // ==================================================

      console.log(
        "\n========== PEDIDOS / CLIENTES =========="
      );

      if (pedidos.length === 0) {
        console.log("Nenhum pedido encontrado.");
      } else {
        pedidos.forEach((pedido) => {
          console.log({
            pedidoId: pedido.id,
            numero: pedido.numero,

            // ID realmente gravado no pedido
            usuarioIdDoPedido: pedido.usuarioId,

            // Usuário encontrado pelo relacionamento
            usuarioIdRelacionado:
              pedido.usuario?.id ?? null,

            nome:
              pedido.usuario?.nome ?? null,

            email:
              pedido.usuario?.email ?? null,

            perfil:
              pedido.usuario?.perfil ?? null,

            status: pedido.status,

            total: Number(pedido.total),
          });
        });
      }

      console.log(
        "=========================================\n"
      );

      return res.json(pedidos);
    } catch (error) {
      console.error(
        "Erro ao buscar pedidos:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao buscar pedidos.",
      });
    }
  }
);

// ======================================================
// GET /api/pedidos/admin/:id
// BUSCAR PEDIDO ADMINISTRATIVO
// ======================================================

router.get(
  "/admin/:id",
  exigirAutenticacao,
  exigirAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "ID do pedido inválido.",
        });
      }

      const pedido = await prisma.pedido.findUnique({
        where: {
          id,
        },

        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
              telefone: true,
              perfil: true,
            },
          },

          itens: {
            include: {
              produto: {
                select: {
                  id: true,
                  nome: true,
                  imagem: true,
                  preco: true,
                },
              },
            },
          },
        },
      });

      if (!pedido) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Pedido não encontrado.",
        });
      }

      return res.json(pedido);
    } catch (error) {
      console.error(
        "Erro ao buscar pedido:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao buscar pedido.",
      });
    }
  }
);

// ======================================================
// GET /api/pedidos
// PEDIDOS DO CLIENTE AUTENTICADO
// ======================================================

router.get(
  "/",
  exigirAutenticacao,
  async (req, res) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          sucesso: false,
          mensagem: "Usuário não autenticado.",
        });
      }

      const pedidos = await prisma.pedido.findMany({
        where: {
          usuarioId: req.usuario.id,
        },

        orderBy: {
          criadoEm: "desc",
        },

        include: {
          itens: {
            include: {
              produto: {
                select: {
                  id: true,
                  nome: true,
                  imagem: true,
                },
              },
            },
          },
        },
      });

      return res.json(pedidos);
    } catch (error) {
      console.error(
        "Erro ao buscar pedidos do cliente:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao buscar seus pedidos.",
      });
    }
  }
);

// ======================================================
// GET /api/pedidos/:id
// DETALHE DO PEDIDO DO CLIENTE
// ======================================================

router.get(
  "/:id",
  exigirAutenticacao,
  async (req, res) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          sucesso: false,
          mensagem: "Usuário não autenticado.",
        });
      }

      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "ID do pedido inválido.",
        });
      }

      const pedido = await prisma.pedido.findFirst({
        where: {
          id,
          usuarioId: req.usuario.id,
        },

        include: {
          itens: {
            include: {
              produto: {
                select: {
                  id: true,
                  nome: true,
                  imagem: true,
                },
              },
            },
          },
        },
      });

      if (!pedido) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Pedido não encontrado.",
        });
      }

      return res.json(pedido);
    } catch (error) {
      console.error(
        "Erro ao buscar pedido:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao buscar pedido.",
      });
    }
  }
);

// ======================================================
// POST /api/pedidos
// CRIAR PEDIDO
// ======================================================

router.post(
  "/",
  exigirAutenticacao,
  async (req, res) => {
    try {
      // ==================================================
      // USUÁRIO AUTENTICADO
      // ==================================================

      if (!req.usuario) {
        return res.status(401).json({
          sucesso: false,
          mensagem: "Usuário não autenticado.",
        });
      }

      // ==================================================
      // SOMENTE CLIENTE PODE REALIZAR PEDIDO
      // ==================================================

      if (req.usuario.perfil !== "CLIENTE") {
        return res.status(403).json({
          sucesso: false,
          mensagem:
            "Apenas clientes podem realizar pedidos.",
        });
      }

      // ==================================================
      // DADOS RECEBIDOS
      // ==================================================

      const {
        itens,
        desconto = 0,
        frete = 0,
      } = req.body;

      // ==================================================
      // VALIDAR ITENS
      // ==================================================

      if (
        !Array.isArray(itens) ||
        itens.length === 0
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "O pedido precisa ter pelo menos um item.",
        });
      }

      // ==================================================
      // NORMALIZAR IDS
      // ==================================================

      const produtoIds = itens.map(
        (item: { produtoId: number }) =>
          Number(item.produtoId)
      );

      if (
        produtoIds.some(
          (produtoId: number) =>
            !Number.isInteger(produtoId) ||
            produtoId <= 0
        )
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Um ou mais produtos são inválidos.",
        });
      }

      // ==================================================
      // BUSCAR PRODUTOS
      // ==================================================

      const produtos =
        await prisma.produto.findMany({
          where: {
            id: {
              in: produtoIds,
            },

            ativo: true,
          },
        });

      const quantidadeProdutosUnicos =
        new Set(produtoIds).size;

      if (
        produtos.length !==
        quantidadeProdutosUnicos
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Um ou mais produtos não estão disponíveis.",
        });
      }

      // ==================================================
      // CALCULAR SUBTOTAL
      // ==================================================

      let subtotal = 0;

      const itensPedido = itens.map(
        (
          item: {
            produtoId: number;
            quantidade: number;
          }
        ) => {
          const produtoId = Number(
            item.produtoId
          );

          const quantidade = Number(
            item.quantidade
          );

          if (
            !Number.isInteger(quantidade) ||
            quantidade <= 0
          ) {
            throw new Error(
              "Quantidade de produto inválida."
            );
          }

          const produto =
            produtos.find(
              (produtoItem) =>
                produtoItem.id ===
                produtoId
            );

          if (!produto) {
            throw new Error(
              "Produto não encontrado."
            );
          }

          if (
            produto.estoque <
            quantidade
          ) {
            throw new Error(
              `Estoque insuficiente para o produto "${produto.nome}".`
            );
          }

          const precoUnitario =
            Number(produto.preco);

          const subtotalItem =
            precoUnitario * quantidade;

          subtotal += subtotalItem;

          return {
            produtoId,
            quantidade,
            precoUnitario,
            subtotal: subtotalItem,
          };
        }
      );

      // ==================================================
      // VALIDAR DESCONTO E FRETE
      // ==================================================

      const descontoNumero =
        Number(desconto);

      const freteNumero =
        Number(frete);

      if (
        !Number.isFinite(
          descontoNumero
        ) ||
        descontoNumero < 0 ||
        !Number.isFinite(
          freteNumero
        ) ||
        freteNumero < 0
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Desconto ou frete inválido.",
        });
      }

      if (
        descontoNumero > subtotal
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "O desconto não pode ser maior que o subtotal.",
        });
      }

      // ==================================================
      // TOTAL
      // ==================================================

      const total =
        subtotal -
        descontoNumero +
        freteNumero;

      // ==================================================
      // NÚMERO DO PEDIDO
      // ==================================================

      const numeroPedido =
        `LUM-${Date.now()}`;

      // ==================================================
      // CRIAR PEDIDO
      // ==================================================

      const pedido =
        await prisma.pedido.create({
          data: {
            numero: numeroPedido,

            // Pedido pertence exclusivamente
            // ao cliente autenticado
            usuarioId:
              req.usuario.id,

            status: "PENDENTE",

            subtotal,

            desconto:
              descontoNumero,

            frete:
              freteNumero,

            total,

            itens: {
              create: itensPedido,
            },
          },

          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                perfil: true,
              },
            },

            itens: {
              include: {
                produto: {
                  select: {
                    id: true,
                    nome: true,
                    imagem: true,
                  },
                },
              },
            },
          },
        });

      // ==================================================
      // RESPOSTA
      // ==================================================

      return res.status(201).json(
        pedido
      );
    } catch (error) {
      console.error(
        "Erro ao criar pedido:",
        error
      );

      const mensagem =
        error instanceof Error
          ? error.message
          : "Erro ao criar pedido.";

      return res.status(400).json({
        sucesso: false,
        mensagem,
      });
    }
  }
);

// ======================================================
// PUT /api/pedidos/admin/:id/status
// ATUALIZAR STATUS
// ======================================================

router.put(
  "/admin/:id/status",
  exigirAutenticacao,
  exigirAdmin,
  async (req, res) => {
    try {
      const id = Number(
        req.params.id
      );

      const { status } = req.body;

      const statusPermitidos = [
        "PENDENTE",
        "CONFIRMADO",
        "EM_PREPARACAO",
        "ENVIADO",
        "ENTREGUE",
        "CANCELADO",
      ];

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "ID do pedido inválido.",
        });
      }

      if (
        !statusPermitidos.includes(
          status
        )
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Status de pedido inválido.",
        });
      }

      const pedidoExistente =
        await prisma.pedido.findUnique({
          where: {
            id,
          },
        });

      if (!pedidoExistente) {
        return res.status(404).json({
          sucesso: false,
          mensagem:
            "Pedido não encontrado.",
        });
      }

      const pedido =
        await prisma.pedido.update({
          where: {
            id,
          },

          data: {
            status,
          },

          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                perfil: true,
              },
            },
          },
        });

      return res.json({
        sucesso: true,
        mensagem:
          "Status do pedido atualizado com sucesso.",
        pedido,
      });
    } catch (error) {
      console.error(
        "Erro ao atualizar status do pedido:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao atualizar status do pedido.",
      });
    }
  }
);

export default router;
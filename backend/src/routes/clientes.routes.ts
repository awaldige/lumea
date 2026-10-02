import { Router } from "express";

import prisma from "../lib/prisma.js";

import {
  exigirAutenticacao,
  exigirAdmin,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// LISTAR CLIENTES
// =========================

router.get(
  "/admin",
  exigirAutenticacao,
  exigirAdmin,
  async (_req, res) => {
    try {
      const clientes = await prisma.usuario.findMany({
        where: {
          perfil: "CLIENTE",
        },

        orderBy: {
          criadoEm: "desc",
        },

        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          perfil: true,
          ativo: true,
          criadoEm: true,
          atualizadoEm: true,
        },
      });

      // =========================
      // CONTAR PEDIDOS DE CADA CLIENTE
      // =========================

      const clientesComPedidos = await Promise.all(
        clientes.map(async (cliente) => {
          const pedidosCount =
            await prisma.pedido.count({
              where: {
                usuarioId: cliente.id,
              },
            });

          return {
            ...cliente,
            pedidosCount,
          };
        })
      );

      // =========================
      // DIAGNÓSTICO
      // =========================

      console.log(
        "\n========== CLIENTES / PEDIDOS =========="
      );

      clientesComPedidos.forEach((cliente) => {
        console.log({
          clienteId: cliente.id,
          nome: cliente.nome,
          email: cliente.email,
          pedidosCount: cliente.pedidosCount,
        });
      });

      console.log(
        "========================================\n"
      );

      return res.json(clientesComPedidos);
    } catch (error) {
      console.error(
        "Erro ao buscar clientes:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao buscar clientes.",
      });
    }
  }
);

// =========================
// BUSCAR CLIENTE
// =========================

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
          mensagem: "ID do cliente inválido.",
        });
      }

      const cliente = await prisma.usuario.findFirst({
        where: {
          id,
          perfil: "CLIENTE",
        },

        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          perfil: true,
          ativo: true,
          criadoEm: true,
          atualizadoEm: true,

          pedidos: {
            orderBy: {
              criadoEm: "desc",
            },

            select: {
              id: true,
              numero: true,
              status: true,
              subtotal: true,
              desconto: true,
              frete: true,
              total: true,
              criadoEm: true,
            },
          },
        },
      });

      if (!cliente) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Cliente não encontrado.",
        });
      }

      // =========================
      // CONTAGEM DIRETA DOS PEDIDOS
      // =========================

      const pedidosCount =
        await prisma.pedido.count({
          where: {
            usuarioId: cliente.id,
          },
        });

      return res.json({
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        perfil: cliente.perfil,
        ativo: cliente.ativo,
        criadoEm: cliente.criadoEm,
        atualizadoEm: cliente.atualizadoEm,

        pedidos: cliente.pedidos,

        pedidosCount,
      });
    } catch (error) {
      console.error(
        "Erro ao buscar cliente:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao buscar cliente.",
      });
    }
  }
);

// =========================
// EDITAR CLIENTE
// =========================

router.put(
  "/admin/:id",
  exigirAutenticacao,
  exigirAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "ID do cliente inválido.",
        });
      }

      const {
        nome,
        email,
        telefone,
      } = req.body;

      // =========================
      // VALIDAÇÕES
      // =========================

      if (
        typeof nome !== "string" ||
        !nome.trim()
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "O nome é obrigatório.",
        });
      }

      if (
        typeof email !== "string" ||
        !email.trim()
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "O e-mail é obrigatório.",
        });
      }

      const emailNormalizado =
        email.trim().toLowerCase();

      // =========================
      // VERIFICAR CLIENTE
      // =========================

      const cliente = await prisma.usuario.findFirst({
        where: {
          id,
          perfil: "CLIENTE",
        },
      });

      if (!cliente) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Cliente não encontrado.",
        });
      }

      // =========================
      // VERIFICAR E-MAIL
      // =========================

      const emailExistente =
        await prisma.usuario.findFirst({
          where: {
            email: emailNormalizado,

            id: {
              not: id,
            },
          },

          select: {
            id: true,
          },
        });

      if (emailExistente) {
        return res.status(409).json({
          sucesso: false,
          mensagem:
            "Este e-mail já está sendo utilizado.",
        });
      }

      // =========================
      // ATUALIZAR CLIENTE
      // =========================

      const clienteAtualizado =
        await prisma.usuario.update({
          where: {
            id,
          },

          data: {
            nome: nome.trim(),

            email: emailNormalizado,

            telefone:
              typeof telefone === "string" &&
              telefone.trim()
                ? telefone.trim()
                : null,
          },

          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            perfil: true,
            ativo: true,
            criadoEm: true,
            atualizadoEm: true,
          },
        });

      // =========================
      // CONTAR PEDIDOS
      // =========================

      const pedidosCount =
        await prisma.pedido.count({
          where: {
            usuarioId: id,
          },
        });

      return res.json({
        sucesso: true,

        mensagem:
          "Cliente atualizado com sucesso.",

        cliente: {
          ...clienteAtualizado,

          pedidosCount,
        },
      });
    } catch (error) {
      console.error(
        "Erro ao atualizar cliente:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao atualizar cliente.",
      });
    }
  }
);

// =========================
// ATIVAR / INATIVAR CLIENTE
// =========================

router.put(
  "/admin/:id/status",
  exigirAutenticacao,
  exigirAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      const { ativo } = req.body;

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "ID do cliente inválido.",
        });
      }

      if (typeof ativo !== "boolean") {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "O status informado é inválido.",
        });
      }

      // =========================
      // VERIFICAR CLIENTE
      // =========================

      const cliente = await prisma.usuario.findFirst({
        where: {
          id,
          perfil: "CLIENTE",
        },
      });

      if (!cliente) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Cliente não encontrado.",
        });
      }

      // =========================
      // ATUALIZAR STATUS
      // =========================

      const clienteAtualizado =
        await prisma.usuario.update({
          where: {
            id,
          },

          data: {
            ativo,
          },

          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            perfil: true,
            ativo: true,
            criadoEm: true,
            atualizadoEm: true,
          },
        });

      // =========================
      // CONTAR PEDIDOS
      // =========================

      const pedidosCount =
        await prisma.pedido.count({
          where: {
            usuarioId: id,
          },
        });

      return res.json({
        sucesso: true,

        mensagem: ativo
          ? "Cliente ativado com sucesso."
          : "Cliente inativado com sucesso.",

        cliente: {
          ...clienteAtualizado,

          pedidosCount,
        },
      });
    } catch (error) {
      console.error(
        "Erro ao atualizar status do cliente:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao atualizar status do cliente.",
      });
    }
  }
);

export default router;
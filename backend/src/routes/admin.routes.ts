import { Router } from "express";

import prisma from "../lib/prisma.js";

import {
  exigirAdmin,
  exigirAutenticacao,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// DASHBOARD ADMINISTRATIVO
// =========================

router.get(
  "/dashboard",
  exigirAutenticacao,
  exigirAdmin,
  async (req, res) => {
    try {
      // =========================
      // PERÍODO DO RELATÓRIO
      // =========================

      const periodoInformado = Number(req.query.periodo);

      const periodo =
        [7, 30, 90].includes(periodoInformado)
          ? periodoInformado
          : 30;

      const dataInicio = new Date();

      dataInicio.setHours(0, 0, 0, 0);
      dataInicio.setDate(
        dataInicio.getDate() - (periodo - 1)
      );

      // =========================
      // RESUMO
      // =========================

      const [
        resumoVendas,
        totalPedidos,
        totalClientes,
        clientesAtivos,
        totalProdutos,
        produtosEstoqueBaixo,
        pedidosPendentes,
        pedidosRecentes,
        vendasPeriodo,
      ] = await Promise.all([
        // -------------------------
        // VENDAS
        // -------------------------

        prisma.pedido.aggregate({
          where: {
            status: {
              not: "CANCELADO",
            },
          },
          _sum: {
            total: true,
          },
          _count: {
            id: true,
          },
        }),

        // -------------------------
        // PEDIDOS
        // -------------------------

        prisma.pedido.count(),

        // -------------------------
        // CLIENTES
        // -------------------------

        prisma.usuario.count({
          where: {
            perfil: "CLIENTE",
          },
        }),

        prisma.usuario.count({
          where: {
            perfil: "CLIENTE",
            ativo: true,
          },
        }),

        // -------------------------
        // PRODUTOS
        // -------------------------

        prisma.produto.count({
          where: {
            ativo: true,
          },
        }),

        // -------------------------
        // ESTOQUE BAIXO
        // -------------------------

        prisma.produto.findMany({
          where: {
            ativo: true,
            estoque: {
              lte: 5,
            },
          },
          orderBy: {
            estoque: "asc",
          },
          take: 10,
          select: {
            id: true,
            nome: true,
            estoque: true,
            imagem: true,
          },
        }),

        // -------------------------
        // PEDIDOS PENDENTES
        // -------------------------

        prisma.pedido.count({
          where: {
            status: "PENDENTE",
          },
        }),

        // -------------------------
        // PEDIDOS RECENTES
        // -------------------------

        prisma.pedido.findMany({
          orderBy: {
            criadoEm: "desc",
          },
          take: 5,
          select: {
            id: true,
            numero: true,
            status: true,
            total: true,
            criadoEm: true,
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
              },
            },
          },
        }),

        // -------------------------
        // VENDAS DO PERÍODO
        // -------------------------

        prisma.pedido.findMany({
          where: {
            status: {
              not: "CANCELADO",
            },
            criadoEm: {
              gte: dataInicio,
            },
          },
          orderBy: {
            criadoEm: "asc",
          },
          select: {
            total: true,
            criadoEm: true,
          },
        }),
      ]);

      // =========================
      // CONVERTER VENDAS POR DIA
      // =========================

      const vendasPorDia = new Map<
        string,
        {
          data: string;
          total: number;
          pedidos: number;
        }
      >();

      for (let i = 0; i < periodo; i++) {
        const data = new Date(dataInicio);

        data.setDate(
          dataInicio.getDate() + i
        );

        const chave = data
          .toISOString()
          .slice(0, 10);

        vendasPorDia.set(chave, {
          data: chave,
          total: 0,
          pedidos: 0,
        });
      }

      for (const pedido of vendasPeriodo) {
        const data = new Date(pedido.criadoEm);

        const chave = data
          .toISOString()
          .slice(0, 10);

        const registro = vendasPorDia.get(chave);

        if (registro) {
          registro.total += Number(pedido.total);
          registro.pedidos += 1;
        }
      }

      const vendas = Array.from(
        vendasPorDia.values()
      );

      // =========================
      // VALORES DO RESUMO
      // =========================

      const vendasTotais = Number(
        resumoVendas._sum.total ?? 0
      );

      const quantidadePedidos =
        Number(resumoVendas._count.id ?? 0);

      const ticketMedio =
        quantidadePedidos > 0
          ? vendasTotais / quantidadePedidos
          : 0;

      // =========================
      // RESPOSTA
      // =========================

      return res.json({
        sucesso: true,

        mensagem:
          "Dashboard carregado com sucesso.",

        administrador: req.usuario,

        resumo: {
          vendas: vendasTotais,
          pedidos: quantidadePedidos,
          clientes: totalClientes,
          clientesAtivos,
          produtos: totalProdutos,
          estoqueBaixo:
            produtosEstoqueBaixo.length,
          pedidosPendentes,
          ticketMedio,
        },

        relatorio: {
          periodo,
          dataInicio,
          dataFim: new Date(),
          vendas,
        },

        pedidosRecentes,

        produtosEstoqueBaixo,
      });
    } catch (error) {
      console.error(
        "Erro ao carregar dashboard:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao carregar dados do dashboard.",
      });
    }
  }
);

export default router;
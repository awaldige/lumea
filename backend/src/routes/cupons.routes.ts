import { Router } from "express";

import prisma from "../lib/prisma.js";
import {
  exigirAdmin,
  exigirAutenticacao,
} from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// VALIDAR CUPOM - CHECKOUT
// =========================

router.post(
  "/validar",
  async (req, res) => {
    try {
      const { codigo, subtotal } = req.body;

      // -------------------------
      // Código
      // -------------------------

      if (
        typeof codigo !== "string" ||
        !codigo.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Informe o código do cupom.",
        });
      }

      const codigoNormalizado = codigo
        .trim()
        .toUpperCase();

      // -------------------------
      // Subtotal
      // -------------------------

      const subtotalNumero = Number(subtotal);

      if (
        !Number.isFinite(subtotalNumero) ||
        subtotalNumero < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Subtotal inválido.",
        });
      }

      // -------------------------
      // Buscar cupom
      // -------------------------

      const cupom =
        await prisma.cupom.findUnique({
          where: {
            codigo: codigoNormalizado,
          },
        });

      if (!cupom) {
        return res.status(404).json({
          success: false,
          message:
            "Cupom inválido ou não encontrado.",
        });
      }

      // -------------------------
      // Status
      // -------------------------

      if (!cupom.ativo) {
        return res.status(400).json({
          success: false,
          message: "Este cupom está inativo.",
        });
      }

      // -------------------------
      // Validade - início
      // -------------------------

      const agora = new Date();

      if (
        cupom.validadeInicio &&
        agora < cupom.validadeInicio
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Este cupom ainda não está disponível.",
        });
      }

      // -------------------------
      // Validade - fim
      // -------------------------

      if (
        cupom.validadeFim &&
        agora > cupom.validadeFim
      ) {
        return res.status(400).json({
          success: false,
          message: "Este cupom está expirado.",
        });
      }

      // -------------------------
      // Limite de uso
      // -------------------------

      if (
        cupom.limiteUso !== null &&
        cupom.usosRealizados >=
          cupom.limiteUso
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Este cupom atingiu o limite de utilizações.",
        });
      }

      // -------------------------
      // Valor mínimo
      // -------------------------

      const valorMinimo =
        cupom.valorMinimo !== null
          ? Number(cupom.valorMinimo)
          : 0;

      if (
        subtotalNumero < valorMinimo
      ) {
        return res.status(400).json({
          success: false,
          message: `Este cupom exige uma compra mínima de R$ ${valorMinimo
            .toFixed(2)
            .replace(".", ",")}.`,
        });
      }

      // -------------------------
      // Calcular desconto
      // -------------------------

      let desconto = 0;

      if (cupom.percentual !== null) {
        const percentual =
          Number(cupom.percentual);

        desconto =
          subtotalNumero *
          (percentual / 100);
      }

      if (cupom.valorFixo !== null) {
        desconto =
          Number(cupom.valorFixo);
      }

      // Nunca permitir desconto maior que o subtotal
      desconto = Math.min(
        Math.max(desconto, 0),
        subtotalNumero
      );

      // Arredondamento financeiro
      desconto =
        Math.round(
          (desconto + Number.EPSILON) * 100
        ) / 100;

      // -------------------------
      // Resposta
      // -------------------------

      return res.json({
        success: true,

        cupom: {
          id: cupom.id,
          codigo: cupom.codigo,

          percentual:
            cupom.percentual !== null
              ? Number(cupom.percentual)
              : null,

          valorFixo:
            cupom.valorFixo !== null
              ? Number(cupom.valorFixo)
              : null,

          valorMinimo,

          desconto,
        },
      });
    } catch (error) {
      console.error(
        "Erro ao validar cupom:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Erro ao validar cupom.",
      });
    }
  }
);

// =========================
// LISTAR CUPONS - ADMIN
// =========================

router.get(
  "/admin",
  exigirAutenticacao,
  exigirAdmin,
  async (_req, res) => {
    try {
      const cupons =
        await prisma.cupom.findMany({
          orderBy: {
            criadoEm: "desc",
          },
        });

      return res.json(cupons);
    } catch (error) {
      console.error(
        "Erro ao buscar cupons:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao buscar cupons.",
      });
    }
  }
);

// =========================
// BUSCAR CUPOM POR ID - ADMIN
// =========================

router.get(
  "/admin/:id",
  exigirAutenticacao,
  exigirAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "ID do cupom inválido.",
        });
      }

      const cupom =
        await prisma.cupom.findUnique({
          where: {
            id,
          },
        });

      if (!cupom) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Cupom não encontrado.",
        });
      }

      return res.json(cupom);
    } catch (error) {
      console.error(
        "Erro ao buscar cupom:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao buscar cupom.",
      });
    }
  }
);

// =========================
// CRIAR CUPOM
// =========================

router.post(
  "/",
  exigirAutenticacao,
  exigirAdmin,
  async (req, res) => {
    try {
      const {
        codigo,
        descricao,
        percentual,
        valorFixo,
        valorMinimo,
        limiteUso,
        ativo,
        validadeInicio,
        validadeFim,
      } = req.body;

      // -------------------------
      // Código
      // -------------------------

      if (
        typeof codigo !== "string" ||
        !codigo.trim()
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "O código do cupom é obrigatório.",
        });
      }

      const codigoNormalizado =
        codigo.trim().toUpperCase();

      // -------------------------
      // Verificar duplicidade
      // -------------------------

      const cupomExistente =
        await prisma.cupom.findUnique({
          where: {
            codigo: codigoNormalizado,
          },
        });

      if (cupomExistente) {
        return res.status(409).json({
          sucesso: false,
          mensagem:
            "Já existe um cupom com este código.",
        });
      }

      // -------------------------
      // Percentual
      // -------------------------

      let percentualValor:
        | number
        | undefined;

      if (
        percentual !== undefined &&
        percentual !== null &&
        percentual !== ""
      ) {
        percentualValor =
          Number(percentual);

        if (
          !Number.isFinite(
            percentualValor
          ) ||
          percentualValor <= 0 ||
          percentualValor > 100
        ) {
          return res.status(400).json({
            sucesso: false,
            mensagem:
              "O percentual deve estar entre 0,01 e 100.",
          });
        }
      }

      // -------------------------
      // Valor fixo
      // -------------------------

      let valorFixoValor:
        | number
        | undefined;

      if (
        valorFixo !== undefined &&
        valorFixo !== null &&
        valorFixo !== ""
      ) {
        valorFixoValor =
          Number(valorFixo);

        if (
          !Number.isFinite(
            valorFixoValor
          ) ||
          valorFixoValor <= 0
        ) {
          return res.status(400).json({
            sucesso: false,
            mensagem:
              "O valor fixo deve ser maior que zero.",
          });
        }
      }

      // Exatamente um tipo de desconto
      if (
        (percentualValor === undefined &&
          valorFixoValor === undefined) ||
        (percentualValor !== undefined &&
          valorFixoValor !== undefined)
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Informe percentual ou valor fixo, mas não os dois.",
        });
      }

      // -------------------------
      // Valor mínimo
      // -------------------------

      let valorMinimoValor:
        | number
        | undefined;

      if (
        valorMinimo !== undefined &&
        valorMinimo !== null &&
        valorMinimo !== ""
      ) {
        valorMinimoValor =
          Number(valorMinimo);

        if (
          !Number.isFinite(
            valorMinimoValor
          ) ||
          valorMinimoValor < 0
        ) {
          return res.status(400).json({
            sucesso: false,
            mensagem:
              "O valor mínimo não pode ser negativo.",
          });
        }
      }

      // -------------------------
      // Limite de uso
      // -------------------------

      let limiteUsoValor:
        | number
        | undefined;

      if (
        limiteUso !== undefined &&
        limiteUso !== null &&
        limiteUso !== ""
      ) {
        limiteUsoValor =
          Number(limiteUso);

        if (
          !Number.isInteger(
            limiteUsoValor
          ) ||
          limiteUsoValor <= 0
        ) {
          return res.status(400).json({
            sucesso: false,
            mensagem:
              "O limite de uso deve ser um número inteiro maior que zero.",
          });
        }
      }

      // -------------------------
      // Datas
      // -------------------------

      let dataInicio:
        | Date
        | undefined;

      let dataFim:
        | Date
        | undefined;

      if (validadeInicio) {
        dataInicio =
          new Date(validadeInicio);

        if (
          Number.isNaN(
            dataInicio.getTime()
          )
        ) {
          return res.status(400).json({
            sucesso: false,
            mensagem:
              "A data de início da validade é inválida.",
          });
        }
      }

      if (validadeFim) {
        dataFim =
          new Date(validadeFim);

        if (
          Number.isNaN(
            dataFim.getTime()
          )
        ) {
          return res.status(400).json({
            sucesso: false,
            mensagem:
              "A data de fim da validade é inválida.",
          });
        }
      }

      if (
        dataInicio &&
        dataFim &&
        dataFim < dataInicio
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "A data final não pode ser anterior à data inicial.",
        });
      }

      // -------------------------
      // Criar
      // -------------------------

      const cupom =
        await prisma.cupom.create({
          data: {
            codigo:
              codigoNormalizado,

            descricao:
              typeof descricao ===
                "string" &&
              descricao.trim()
                ? descricao.trim()
                : null,

            percentual:
              percentualValor,

            valorFixo:
              valorFixoValor,

            valorMinimo:
              valorMinimoValor,

            limiteUso:
              limiteUsoValor,

            ativo:
              typeof ativo ===
              "boolean"
                ? ativo
                : true,

            validadeInicio:
              dataInicio,

            validadeFim:
              dataFim,
          },
        });

      return res
        .status(201)
        .json(cupom);
    } catch (error) {
      console.error(
        "Erro ao criar cupom:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao criar cupom.",
      });
    }
  }
);

// =========================
// ATUALIZAR CUPOM
// =========================

router.put(
  "/:id",
  exigirAutenticacao,
  exigirAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "ID do cupom inválido.",
        });
      }

      const cupomExistente =
        await prisma.cupom.findUnique({
          where: {
            id,
          },
        });

      if (!cupomExistente) {
        return res.status(404).json({
          sucesso: false,
          mensagem:
            "Cupom não encontrado.",
        });
      }

      const {
        codigo,
        descricao,
        percentual,
        valorFixo,
        valorMinimo,
        limiteUso,
        ativo,
        validadeInicio,
        validadeFim,
      } = req.body;

      // -------------------------
      // Código
      // -------------------------

      if (
        typeof codigo !== "string" ||
        !codigo.trim()
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "O código do cupom é obrigatório.",
        });
      }

      const codigoNormalizado =
        codigo.trim().toUpperCase();

      const cupomDuplicado =
        await prisma.cupom.findFirst({
          where: {
            codigo: codigoNormalizado,
            id: {
              not: id,
            },
          },
        });

      if (cupomDuplicado) {
        return res.status(409).json({
          sucesso: false,
          mensagem:
            "Já existe outro cupom com este código.",
        });
      }

      // -------------------------
      // Percentual
      // -------------------------

      let percentualValor:
        | number
        | null = null;

      if (
        percentual !== undefined &&
        percentual !== null &&
        percentual !== ""
      ) {
        percentualValor =
          Number(percentual);

        if (
          !Number.isFinite(
            percentualValor
          ) ||
          percentualValor <= 0 ||
          percentualValor > 100
        ) {
          return res.status(400).json({
            sucesso: false,
            mensagem:
              "O percentual deve estar entre 0,01 e 100.",
          });
        }
      }

      // -------------------------
      // Valor fixo
      // -------------------------

      let valorFixoValor:
        | number
        | null = null;

      if (
        valorFixo !== undefined &&
        valorFixo !== null &&
        valorFixo !== ""
      ) {
        valorFixoValor =
          Number(valorFixo);

        if (
          !Number.isFinite(
            valorFixoValor
          ) ||
          valorFixoValor <= 0
        ) {
          return res.status(400).json({
            sucesso: false,
            mensagem:
              "O valor fixo deve ser maior que zero.",
          });
        }
      }

      if (
        (percentualValor === null &&
          valorFixoValor === null) ||
        (percentualValor !== null &&
          valorFixoValor !== null)
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Informe percentual ou valor fixo, mas não os dois.",
        });
      }

      // -------------------------
      // Valor mínimo
      // -------------------------

      let valorMinimoValor:
        | number
        | null = null;

      if (
        valorMinimo !== undefined &&
        valorMinimo !== null &&
        valorMinimo !== ""
      ) {
        valorMinimoValor =
          Number(valorMinimo);

        if (
          !Number.isFinite(
            valorMinimoValor
          ) ||
          valorMinimoValor < 0
        ) {
          return res.status(400).json({
            sucesso: false,
            mensagem:
              "O valor mínimo não pode ser negativo.",
          });
        }
      }

      // -------------------------
      // Limite de uso
      // -------------------------

      let limiteUsoValor:
        | number
        | null = null;

      if (
        limiteUso !== undefined &&
        limiteUso !== null &&
        limiteUso !== ""
      ) {
        limiteUsoValor =
          Number(limiteUso);

        if (
          !Number.isInteger(
            limiteUsoValor
          ) ||
          limiteUsoValor <= 0
        ) {
          return res.status(400).json({
            sucesso: false,
            mensagem:
              "O limite de uso deve ser um número inteiro maior que zero.",
          });
        }
      }

      if (
        limiteUsoValor !== null &&
        limiteUsoValor <
          cupomExistente.usosRealizados
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "O limite de uso não pode ser menor que a quantidade de usos já realizados.",
        });
      }

      // -------------------------
      // Datas
      // -------------------------

      let dataInicio:
        | Date
        | null = null;

      let dataFim:
        | Date
        | null = null;

      if (validadeInicio) {
        dataInicio =
          new Date(validadeInicio);

        if (
          Number.isNaN(
            dataInicio.getTime()
          )
        ) {
          return res.status(400).json({
            sucesso: false,
            mensagem:
              "A data de início da validade é inválida.",
          });
        }
      }

      if (validadeFim) {
        dataFim =
          new Date(validadeFim);

        if (
          Number.isNaN(
            dataFim.getTime()
          )
        ) {
          return res.status(400).json({
            sucesso: false,
            mensagem:
              "A data de fim da validade é inválida.",
          });
        }
      }

      if (
        dataInicio &&
        dataFim &&
        dataFim < dataInicio
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "A data final não pode ser anterior à data inicial.",
        });
      }

      // -------------------------
      // Atualizar
      // -------------------------

      const cupom =
        await prisma.cupom.update({
          where: {
            id,
          },

          data: {
            codigo:
              codigoNormalizado,

            descricao:
              typeof descricao ===
                "string" &&
              descricao.trim()
                ? descricao.trim()
                : null,

            percentual:
              percentualValor,

            valorFixo:
              valorFixoValor,

            valorMinimo:
              valorMinimoValor,

            limiteUso:
              limiteUsoValor,

            ativo:
              typeof ativo ===
              "boolean"
                ? ativo
                : cupomExistente.ativo,

            validadeInicio:
              dataInicio,

            validadeFim:
              dataFim,
          },
        });

      return res.json(cupom);
    } catch (error) {
      console.error(
        "Erro ao atualizar cupom:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao atualizar cupom.",
      });
    }
  }
);

// =========================
// INATIVAR CUPOM
// =========================

router.delete(
  "/:id",
  exigirAutenticacao,
  exigirAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "ID do cupom inválido.",
        });
      }

      const cupom =
        await prisma.cupom.findUnique({
          where: {
            id,
          },
        });

      if (!cupom) {
        return res.status(404).json({
          sucesso: false,
          mensagem:
            "Cupom não encontrado.",
        });
      }

      const cupomAtualizado =
        await prisma.cupom.update({
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
          "Cupom inativado com sucesso.",
        cupom: cupomAtualizado,
      });
    } catch (error) {
      console.error(
        "Erro ao inativar cupom:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao inativar cupom.",
      });
    }
  }
);

export default router;
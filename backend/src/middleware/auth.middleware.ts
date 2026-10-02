import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não configurado no ambiente.");
}

export type UsuarioAutenticado = {
  id: number;
  nome: string;
  email: string;
  perfil: "CLIENTE" | "ADMIN";
};

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado;
    }
  }
}

export async function exigirAutenticacao(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "Token não informado.",
      });
    }

    const token = authorization.substring(7);

    const payload = jwt.verify(token, JWT_SECRET!);

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

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        ativo: true,
      },
    });

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "Usuário não encontrado ou inativo.",
      });
    }

    req.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
    };

    next();
  } catch (error) {
    console.error("Erro na autenticação:", error);

    return res.status(401).json({
      sucesso: false,
      mensagem: "Sessão inválida ou expirada.",
    });
  }
}

export function exigirAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.usuario) {
    return res.status(401).json({
      sucesso: false,
      mensagem: "Usuário não autenticado.",
    });
  }

  if (req.usuario.perfil !== "ADMIN") {
    return res.status(403).json({
      sucesso: false,
      mensagem: "Acesso administrativo não autorizado.",
    });
  }

  next();
}
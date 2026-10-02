import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma.js";

const email = "admin@lumea.com";
const senha = "Admin@123456";

async function criarAdmin() {
  try {
    const senhaHash = await bcrypt.hash(senha, 12);

    const usuarioExistente = await prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    if (usuarioExistente) {
      const admin = await prisma.usuario.update({
        where: {
          id: usuarioExistente.id,
        },
        data: {
          perfil: "ADMIN",
          ativo: true,
          senhaHash,
        },
      });

      console.log("Usuário atualizado para ADMIN:");
      console.log({
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        perfil: admin.perfil,
        ativo: admin.ativo,
      });

      return;
    }

    const admin = await prisma.usuario.create({
      data: {
        nome: "Administrador LUMÉA",
        email,
        senhaHash,
        perfil: "ADMIN",
        ativo: true,
      },
    });

    console.log("Administrador criado com sucesso:");
    console.log({
      id: admin.id,
      nome: admin.nome,
      email: admin.email,
      perfil: admin.perfil,
      ativo: admin.ativo,
    });
  } catch (error) {
    console.error("Erro ao criar administrador:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

criarAdmin();
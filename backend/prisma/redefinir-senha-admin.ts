import "dotenv/config";
import bcrypt from "bcryptjs";
import readline from "node:readline";
import prisma from "../src/lib/prisma.js";

const email = "admin@lumea.com";

function perguntarSenha(): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    process.stdout.write("Nova senha: ");

    let senha = "";

    process.stdin.setRawMode?.(true);

    process.stdin.on("data", (caractere) => {
      const tecla = caractere.toString();

      if (tecla === "\r" || tecla === "\n") {
        process.stdin.setRawMode?.(false);
        rl.close();
        process.stdout.write("\n");
        resolve(senha);
        return;
      }

      if (tecla === "\u0003") {
        process.stdin.setRawMode?.(false);
        rl.close();
        process.exit(0);
      }

      if (tecla === "\u007f") {
        senha = senha.slice(0, -1);
        return;
      }

      senha += tecla;
    });
  });
}

async function redefinirSenha() {
  try {
    const senha = await perguntarSenha();

    if (senha.length < 6) {
      throw new Error(
        "A senha deve ter pelo menos 6 caracteres."
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    if (!usuario) {
      throw new Error(
        `Usuário ${email} não encontrado.`
      );
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    await prisma.usuario.update({
      where: {
        id: usuario.id,
      },
      data: {
        senhaHash,
        perfil: "ADMIN",
        ativo: true,
      },
    });

    console.log("Senha do administrador redefinida com sucesso.");
    console.log(`Usuário: ${email}`);
  } catch (error) {
    console.error(
      "Erro ao redefinir senha:",
      error instanceof Error ? error.message : error
    );

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

redefinirSenha();

import "dotenv/config";

import prisma from "../src/lib/prisma.js";

async function main() {
  console.log("Vinculando produtos à coleção Essência...");

  const colecao = await prisma.colecao.findUnique({
    where: {
      slug: "essencia",
    },
  });

  if (!colecao) {
    throw new Error("Coleção Essência não encontrada.");
  }

  const resultado = await prisma.produto.updateMany({
    where: {
      ativo: true,
    },
    data: {
      colecaoId: colecao.id,
    },
  });

  console.log(
    `${resultado.count} produto(s) vinculado(s) à coleção "${colecao.nome}".`
  );
}

main()
  .catch((error) => {
    console.error("Erro ao vincular produtos:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
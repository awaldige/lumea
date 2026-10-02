import "dotenv/config";

import prisma from "../src/lib/prisma.js";

async function main() {
  console.log("Criando coleção Essência...");

  const colecao = await prisma.colecao.upsert({
    where: {
      slug: "essencia",
    },
    update: {
      nome: "Essência",
      descricao:
        "Peças artesanais criadas com cuidado, delicadeza e identidade.",
      ativo: true,
    },
    create: {
      nome: "Essência",
      slug: "essencia",
      descricao:
        "Peças artesanais criadas com cuidado, delicadeza e identidade.",
      ativo: true,
    },
  });

  console.log("Coleção criada/atualizada:");
  console.log(colecao);
}

main()
  .catch((error) => {
    console.error("Erro ao criar coleção:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
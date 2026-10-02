import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não configurado no arquivo .env.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

function obterVariavelObrigatoria(
  nome: string
): string {
  const valor = process.env[nome]?.trim();

  if (!valor) {
    throw new Error(
      `A variável ${nome} não foi configurada no arquivo .env.`
    );
  }

  return valor;
}

async function main() {
  console.log("Iniciando seed da LUMÉA...");

  // =========================
  // ADMINISTRADOR
  // =========================

  const adminNome = obterVariavelObrigatoria("ADMIN_NOME");
  const adminNomeUsuario =
    obterVariavelObrigatoria("ADMIN_USUARIO");
  const adminEmail =
    obterVariavelObrigatoria("ADMIN_EMAIL");
  const adminSenha =
    obterVariavelObrigatoria("ADMIN_SENHA");

  if (adminSenha.length < 6) {
    throw new Error(
      "ADMIN_SENHA deve possuir pelo menos 6 caracteres."
    );
  }

  const bcrypt = await import("bcryptjs");

  const senhaHash = await bcrypt.hash(
    adminSenha,
    12
  );

  const administrador =
    await prisma.usuario.upsert({
      where: {
        email: adminEmail,
      },

      update: {
        nome: adminNome,
        nomeUsuario: adminNomeUsuario,
        senhaHash,
        perfil: "ADMIN",
        ativo: true,
      },

      create: {
        nome: adminNome,
        nomeUsuario: adminNomeUsuario,
        email: adminEmail,
        senhaHash,
        perfil: "ADMIN",
        ativo: true,
      },
    });

  console.log(
    `Administrador configurado: ${administrador.email}`
  );

  // =========================
  // CATEGORIAS
  // =========================

  const brincos = await prisma.categoria.upsert({
    where: {
      slug: "brincos",
    },

    update: {},

    create: {
      nome: "Brincos",
      slug: "brincos",
      descricao:
        "Peças delicadas e sofisticadas para todos os momentos.",
    },
  });

  const colares = await prisma.categoria.upsert({
    where: {
      slug: "colares",
    },

    update: {},

    create: {
      nome: "Colares",
      slug: "colares",
      descricao:
        "Colares que combinam elegância, delicadeza e personalidade.",
    },
  });

  const pulseiras = await prisma.categoria.upsert({
    where: {
      slug: "pulseiras",
    },

    update: {},

    create: {
      nome: "Pulseiras",
      slug: "pulseiras",
      descricao:
        "Detalhes sofisticados para complementar cada produção.",
    },
  });

  console.log("Categorias cadastradas.");

  // =========================
  // PRODUTOS
  // =========================

  const produtos = [
    {
      nome: "Elegance Drop",
      slug: "elegance-drop",
      descricao:
        "Uma peça delicada e sofisticada, criada para trazer elegância aos pequenos detalhes.",
      preco: 129.9,
      precoOferta: null,
      estoque: 20,
      destaque: true,
      novo: true,
      oferta: false,
      categoriaId: brincos.id,
    },

    {
      nome: "Lumière",
      slug: "lumiere",
      descricao:
        "Um colar delicado que combina sofisticação e versatilidade para diferentes momentos.",
      preco: 159.9,
      precoOferta: null,
      estoque: 20,
      destaque: true,
      novo: true,
      oferta: false,
      categoriaId: colares.id,
    },

    {
      nome: "Essence",
      slug: "essence",
      descricao:
        "Uma pulseira elegante pensada para complementar produções com delicadeza.",
      preco: 139.9,
      precoOferta: 119.9,
      estoque: 20,
      destaque: true,
      novo: false,
      oferta: true,
      categoriaId: pulseiras.id,
    },

    {
      nome: "Éclat",
      slug: "eclat",
      descricao:
        "Uma peça sofisticada para quem aprecia detalhes discretos e elegantes.",
      preco: 119.9,
      precoOferta: null,
      estoque: 20,
      destaque: true,
      novo: false,
      oferta: false,
      categoriaId: brincos.id,
    },

    {
      nome: "Pure Lumière",
      slug: "pure-lumiere",
      descricao:
        "Elegância minimalista em uma peça criada para acompanhar diferentes ocasiões.",
      preco: 179.9,
      precoOferta: null,
      estoque: 20,
      destaque: false,
      novo: true,
      oferta: false,
      categoriaId: colares.id,
    },

    {
      nome: "Étoile",
      slug: "etoile",
      descricao:
        "Uma pulseira inspirada na delicadeza e no brilho dos pequenos detalhes.",
      preco: 149.9,
      precoOferta: 129.9,
      estoque: 20,
      destaque: false,
      novo: false,
      oferta: true,
      categoriaId: pulseiras.id,
    },

    {
      nome: "Belle",
      slug: "belle",
      descricao:
        "Uma escolha delicada para completar o visual com personalidade.",
      preco: 109.9,
      precoOferta: null,
      estoque: 20,
      destaque: false,
      novo: false,
      oferta: false,
      categoriaId: brincos.id,
    },

    {
      nome: "Élégance",
      slug: "elegance",
      descricao:
        "Uma peça marcante que traduz a proposta elegante e atemporal da LUMÉA.",
      preco: 189.9,
      precoOferta: 169.9,
      estoque: 20,
      destaque: false,
      novo: false,
      oferta: true,
      categoriaId: colares.id,
    },
  ];

  for (const produto of produtos) {
    await prisma.produto.upsert({
      where: {
        slug: produto.slug,
      },

      update: {
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        precoOferta: produto.precoOferta,
        estoque: produto.estoque,
        destaque: produto.destaque,
        novo: produto.novo,
        oferta: produto.oferta,
        categoriaId: produto.categoriaId,
        ativo: true,
      },

      create: {
        nome: produto.nome,
        slug: produto.slug,
        descricao: produto.descricao,
        preco: produto.preco,
        precoOferta: produto.precoOferta,
        estoque: produto.estoque,
        destaque: produto.destaque,
        novo: produto.novo,
        oferta: produto.oferta,
        categoriaId: produto.categoriaId,
        ativo: true,
      },
    });
  }

  console.log(
    `${produtos.length} produtos cadastrados.`
  );

  console.log(
    "Seed da LUMÉA concluído com sucesso."
  );
}

main()
  .catch((error) => {
    console.error(
      "Erro ao executar seed:",
      error
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
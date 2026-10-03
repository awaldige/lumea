import "dotenv/config";

import express from "express";
import cors from "cors";
import path from "path";

import prisma from "./lib/prisma.js";

import categoriasRoutes from "./routes/categorias.routes.js";
import produtosRoutes from "./routes/produtos.routes.js";
import colecoesRoutes from "./routes/colecoes.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import cuponsRoutes from "./routes/cupons.routes.js";
import pedidosRoutes from "./routes/pedidos.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";

const app = express();

const PORT = Number(process.env.PORT) || 4000;

// =========================
// DIAGNÓSTICO DO BANCO
// =========================

const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  try {
    const dbUrl = new URL(databaseUrl);

    console.log("DATABASE HOST:", dbUrl.hostname);
  } catch {
    console.log("DATABASE HOST: URL inválida");
  }
} else {
  console.log("DATABASE HOST: DATABASE_URL não definida");
}

// =========================
// CONFIGURAÇÕES
// =========================

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL || "http://localhost:3000",
  })
);

app.use(express.json());

// =========================
// ARQUIVOS / UPLOADS
// =========================

app.use(
  "/uploads",
  express.static(path.resolve("uploads"))
);

// =========================
// STATUS DA API
// =========================

app.get("/api/status", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      sucesso: true,
      projeto: "LUMÉA",
      api: "online",
      banco: "conectado",
      mensagem: "API LUMÉA funcionando corretamente.",
    });
  } catch (error) {
    console.error(
      "Erro ao conectar ao banco:",
      error
    );

    res.status(500).json({
      sucesso: false,
      projeto: "LUMÉA",
      api: "online",
      banco: "erro",
      mensagem:
        "API funcionando, mas o banco não respondeu.",
    });
  }
});

// =========================
// ROTAS DA API
// =========================

app.use(
  "/api/categorias",
  categoriasRoutes
);

app.use(
  "/api/produtos",
  produtosRoutes
);

app.use(
  "/api/colecoes",
  colecoesRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/cupons",
  cuponsRoutes
);

app.use(
  "/api/pedidos",
  pedidosRoutes
);

app.use(
  "/api/clientes",
  clientesRoutes
);

// =========================
// INICIALIZAÇÃO
// =========================

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `LUMÉA API rodando na porta ${PORT}`
  );
});
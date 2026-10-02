-- AlterTable
ALTER TABLE "produtos" ADD COLUMN     "colecaoId" INTEGER;

-- CreateTable
CREATE TABLE "colecoes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colecoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "colecoes_slug_key" ON "colecoes"("slug");

-- CreateIndex
CREATE INDEX "produtos_colecaoId_idx" ON "produtos"("colecaoId");

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_colecaoId_fkey" FOREIGN KEY ("colecaoId") REFERENCES "colecoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

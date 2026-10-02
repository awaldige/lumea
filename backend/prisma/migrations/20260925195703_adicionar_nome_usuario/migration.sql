/*
  Warnings:

  - A unique constraint covering the columns `[nomeUsuario]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "nomeUsuario" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_nomeUsuario_key" ON "usuarios"("nomeUsuario");

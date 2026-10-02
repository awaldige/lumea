-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('CLIENTE', 'ADMIN');

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "perfil" "PerfilUsuario" NOT NULL DEFAULT 'CLIENTE';

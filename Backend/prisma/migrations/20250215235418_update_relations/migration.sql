/*
  Warnings:

  - You are about to drop the column `coleccion` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `historial` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuarioId]` on the table `Historial` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Historial" ADD COLUMN     "usuarioId" INTEGER;

-- AlterTable
ALTER TABLE "Skins" ADD COLUMN     "usuarioId" INTEGER;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "coleccion",
DROP COLUMN "historial";

-- CreateIndex
CREATE UNIQUE INDEX "Historial_usuarioId_key" ON "Historial"("usuarioId");

-- AddForeignKey
ALTER TABLE "Historial" ADD CONSTRAINT "Historial_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skins" ADD CONSTRAINT "Skins_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `Skins` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Skins" DROP CONSTRAINT "Skins_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Skins" DROP COLUMN "usuarioId";

-- CreateTable
CREATE TABLE "_UsuarioSkins" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UsuarioSkins_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UsuarioSkins_B_index" ON "_UsuarioSkins"("B");

-- AddForeignKey
ALTER TABLE "_UsuarioSkins" ADD CONSTRAINT "_UsuarioSkins_A_fkey" FOREIGN KEY ("A") REFERENCES "Skins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioSkins" ADD CONSTRAINT "_UsuarioSkins_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

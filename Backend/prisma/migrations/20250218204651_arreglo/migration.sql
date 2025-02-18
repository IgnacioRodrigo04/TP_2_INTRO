/*
  Warnings:

  - The `kda` column on the `Historial` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Historial" DROP COLUMN "kda",
ADD COLUMN     "kda" DECIMAL(65,30) NOT NULL DEFAULT 0;

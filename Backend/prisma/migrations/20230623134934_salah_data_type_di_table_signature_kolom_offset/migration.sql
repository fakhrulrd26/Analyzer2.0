/*
  Warnings:

  - Changed the type of `offset` on the `Signature` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Signature" DROP COLUMN "offset",
ADD COLUMN     "offset" INTEGER NOT NULL;

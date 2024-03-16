/*
  Warnings:

  - You are about to drop the column `country` on the `User` table. All the data in the column will be lost.
  - Added the required column `country_code` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "country",
ADD COLUMN     "country_code" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Country" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("code")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "Country"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

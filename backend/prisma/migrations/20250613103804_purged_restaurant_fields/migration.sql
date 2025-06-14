/*
  Warnings:

  - You are about to drop the column `address` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `Restaurant` table. All the data in the column will be lost.
  - Added the required column `pincode` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "state",
DROP COLUMN "zip",
ADD COLUMN     "pincode" TEXT NOT NULL;

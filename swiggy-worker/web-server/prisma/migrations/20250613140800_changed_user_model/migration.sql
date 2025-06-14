/*
  Warnings:

  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone",
ADD COLUMN     "image" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "onboarded" BOOLEAN NOT NULL DEFAULT false;

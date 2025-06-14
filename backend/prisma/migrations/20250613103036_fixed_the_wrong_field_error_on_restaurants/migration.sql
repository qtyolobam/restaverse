/*
  Warnings:

  - You are about to drop the column `scrapeRequestId` on the `Restaurant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Restaurant" DROP CONSTRAINT "Restaurant_scrapeRequestId_fkey";

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "scrapeRequestId";

-- AlterTable
ALTER TABLE "SwiggyRestaurant" ADD COLUMN     "scrapeRequestId" TEXT;

-- AddForeignKey
ALTER TABLE "SwiggyRestaurant" ADD CONSTRAINT "SwiggyRestaurant_scrapeRequestId_fkey" FOREIGN KEY ("scrapeRequestId") REFERENCES "ScrapeRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

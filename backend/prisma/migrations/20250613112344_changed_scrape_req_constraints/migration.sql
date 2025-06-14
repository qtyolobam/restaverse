/*
  Warnings:

  - Made the column `scrapeRequestId` on table `SwiggyRestaurant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SwiggyRestaurant" DROP CONSTRAINT "SwiggyRestaurant_scrapeRequestId_fkey";

-- AlterTable
ALTER TABLE "SwiggyRestaurant" ALTER COLUMN "scrapeRequestId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "SwiggyRestaurant" ADD CONSTRAINT "SwiggyRestaurant_scrapeRequestId_fkey" FOREIGN KEY ("scrapeRequestId") REFERENCES "ScrapeRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `description` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `MenuItem` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "SwiggyRestaurant_url_idx";

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "description",
DROP COLUMN "imageUrl",
DROP COLUMN "rating";

-- CreateIndex
CREATE INDEX "SwiggyRestaurant_scrapeRequestId_idx" ON "SwiggyRestaurant"("scrapeRequestId");

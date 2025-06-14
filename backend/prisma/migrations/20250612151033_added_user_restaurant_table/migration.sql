/*
  Warnings:

  - You are about to drop the column `area` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `cuisines` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryTime` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Restaurant` table. All the data in the column will be lost.
  - Added the required column `address` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_restaurantId_fkey";

-- DropIndex
DROP INDEX "Restaurant_url_idx";

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "area",
DROP COLUMN "cuisines",
DROP COLUMN "deliveryTime",
DROP COLUMN "pincode",
DROP COLUMN "rating",
DROP COLUMN "url",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "zip" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SwiggyRestaurant" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" TEXT NOT NULL DEFAULT '0',
    "deliveryTime" TEXT NOT NULL DEFAULT '',
    "cuisines" TEXT NOT NULL DEFAULT '',
    "pincode" TEXT NOT NULL,
    "area" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SwiggyRestaurant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SwiggyRestaurant_url_idx" ON "SwiggyRestaurant"("url");

-- CreateIndex
CREATE INDEX "Restaurant_userId_idx" ON "Restaurant"("userId");

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "SwiggyRestaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

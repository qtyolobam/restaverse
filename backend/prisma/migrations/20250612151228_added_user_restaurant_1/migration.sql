/*
  Warnings:

  - The `cuisines` column on the `SwiggyRestaurant` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SwiggyRestaurant" DROP COLUMN "cuisines",
ADD COLUMN     "cuisines" TEXT[] DEFAULT ARRAY[]::TEXT[];

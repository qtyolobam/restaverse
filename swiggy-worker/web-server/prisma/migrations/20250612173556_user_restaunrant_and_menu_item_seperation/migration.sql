-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_restaurantId_fkey";

-- CreateTable
CREATE TABLE "SwiggyMenuItem" (
    "id" TEXT NOT NULL,
    "swiggyRestaurantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "rating" TEXT NOT NULL DEFAULT '0',
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SwiggyMenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SwiggyMenuItem_swiggyRestaurantId_idx" ON "SwiggyMenuItem"("swiggyRestaurantId");

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwiggyMenuItem" ADD CONSTRAINT "SwiggyMenuItem_swiggyRestaurantId_fkey" FOREIGN KEY ("swiggyRestaurantId") REFERENCES "SwiggyRestaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

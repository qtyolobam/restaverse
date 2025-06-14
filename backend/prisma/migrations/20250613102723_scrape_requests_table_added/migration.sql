-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "scrapeRequestId" TEXT;

-- CreateTable
CREATE TABLE "ScrapeRequest" (
    "id" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "limit" INTEGER NOT NULL,
    "cuisines" TEXT[],
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScrapeRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScrapeRequest" ADD CONSTRAINT "ScrapeRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_scrapeRequestId_fkey" FOREIGN KEY ("scrapeRequestId") REFERENCES "ScrapeRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

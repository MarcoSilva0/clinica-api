-- AlterTable
ALTER TABLE "Appoiments" ADD COLUMN     "statusDetails" TEXT;

-- CreateTable
CREATE TABLE "WaitingList" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "appoimentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaitingList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WaitingList" ADD CONSTRAINT "WaitingList_appoimentId_fkey" FOREIGN KEY ("appoimentId") REFERENCES "Appoiments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

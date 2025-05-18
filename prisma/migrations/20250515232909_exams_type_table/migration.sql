/*
  Warnings:

  - You are about to drop the `ExameType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ExameType";

-- CreateTable
CREATE TABLE "ExamsType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defautlDuration" TEXT NOT NULL,
    "preparationInstruction" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamsType_pkey" PRIMARY KEY ("id")
);

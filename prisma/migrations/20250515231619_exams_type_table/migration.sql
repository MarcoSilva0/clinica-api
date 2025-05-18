-- CreateTable
CREATE TABLE "ExameType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defautl_duration" TEXT NOT NULL,
    "preparationInstruction" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExameType_pkey" PRIMARY KEY ("id")
);

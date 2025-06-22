-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SECRETARIA', 'TOTEM');

-- CreateEnum
CREATE TYPE "AppoimentsStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'WAITING_APPOIMENT', 'IN_APPOINTMENT', 'FINISIHED', 'CANCELED');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birth_date" TEXT,
    "photo" TEXT,
    "role" "Role" NOT NULL DEFAULT 'SECRETARIA',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamTypes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defaultDuration" TEXT NOT NULL,
    "preparationInstruction" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ExamTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appoiments" (
    "id" TEXT NOT NULL,
    "patient_cpf" TEXT NOT NULL,
    "patient_name" TEXT NOT NULL,
    "patient_phone" TEXT NOT NULL,
    "patient_email" TEXT NOT NULL,
    "patient_birth_date" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examsTypeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AppoimentsStatus" NOT NULL DEFAULT 'SCHEDULED',
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Appoiments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "initialized" BOOLEAN NOT NULL DEFAULT false,
    "maxWaitTimeMin" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users" ("email");

-- AddForeignKey
ALTER TABLE "Appoiments"
ADD CONSTRAINT "Appoiments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appoiments"
ADD CONSTRAINT "Appoiments_examsTypeId_fkey" FOREIGN KEY ("examsTypeId") REFERENCES "ExamTypes" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- CreateEnum
CREATE TYPE "AppoimentsStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'WAITING_APPOIMENT', 'IN_APPOINTMENT', 'FINISIHED', 'CANCELED');

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

-- AddForeignKey
ALTER TABLE "Appoiments" ADD CONSTRAINT "Appoiments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appoiments" ADD CONSTRAINT "Appoiments_examsTypeId_fkey" FOREIGN KEY ("examsTypeId") REFERENCES "ExamsType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

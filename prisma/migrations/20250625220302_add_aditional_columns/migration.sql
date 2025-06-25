-- AlterTable
ALTER TABLE "Appoiments" ADD COLUMN     "canceledDate" TIMESTAMP(3),
ADD COLUMN     "confirmationDate" TIMESTAMP(3),
ADD COLUMN     "finishedDate" TIMESTAMP(3),
ADD COLUMN     "givenUpDate" TIMESTAMP(3);

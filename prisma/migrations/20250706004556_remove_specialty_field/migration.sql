/*
  Warnings:

  - You are about to drop the column `specialty` on the `manicurists` table. All the data in the column will be lost.
  - Added the required column `documentNumber` to the `clients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentType` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking_link_services" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "documentNumber" TEXT NOT NULL,
ADD COLUMN     "documentType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "manicurists" DROP COLUMN "specialty";

-- CreateTable
CREATE TABLE "spa_schedules" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER,
    "isHoliday" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "specificDate" TIMESTAMP(3),
    "description" TEXT,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spa_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "spa_schedules_spaId_dayOfWeek_isHoliday_key" ON "spa_schedules"("spaId", "dayOfWeek", "isHoliday");

-- AddForeignKey
ALTER TABLE "spa_schedules" ADD CONSTRAINT "spa_schedules_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

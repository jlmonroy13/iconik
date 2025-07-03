/*
  Warnings:

  - The values [CONFIRMED] on the enum `AppointmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `estimatedDuration` to the `AppointmentService` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FollowUpNotificationType" AS ENUM ('EMAIL', 'SMS', 'PUSH', 'DASHBOARD');

-- CreateEnum
CREATE TYPE "FollowUpNotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SalesGoalType" AS ENUM ('REVENUE', 'SERVICES', 'CLIENTS', 'APPOINTMENTS');

-- CreateEnum
CREATE TYPE "SalesGoalPeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "ApprovalAction" AS ENUM ('APPROVE', 'REJECT', 'REQUEST_CHANGES');

-- CreateEnum
CREATE TYPE "PreConfirmationReminderType" AS ENUM ('EMAIL', 'SMS', 'PUSH', 'DASHBOARD');

-- CreateEnum
CREATE TYPE "PreConfirmationReminderStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CashRegisterShiftStatus" AS ENUM ('OPEN', 'CLOSED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "CashRegisterTransactionType" AS ENUM ('PAYMENT_RECEIVED', 'PAYMENT_REFUND', 'CASH_DEPOSIT', 'CASH_WITHDRAWAL', 'EXPENSE_PAYMENT', 'CHANGE_GIVEN', 'OPENING_BALANCE', 'CLOSING_BALANCE', 'ADJUSTMENT', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "AppointmentStatus_new" AS ENUM ('PENDING_APPROVAL', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
ALTER TABLE "Appointment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Appointment" ALTER COLUMN "status" TYPE "AppointmentStatus_new" USING ("status"::text::"AppointmentStatus_new");
ALTER TYPE "AppointmentStatus" RENAME TO "AppointmentStatus_old";
ALTER TYPE "AppointmentStatus_new" RENAME TO "AppointmentStatus";
DROP TYPE "AppointmentStatus_old";
ALTER TABLE "Appointment" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED';
COMMIT;

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "approvalNotes" TEXT,
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "bookingLinkId" TEXT,
ADD COLUMN     "preConfirmationNotes" TEXT,
ADD COLUMN     "preConfirmationReminderSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preConfirmedAt" TIMESTAMP(3),
ADD COLUMN     "preConfirmedBy" TEXT,
ADD COLUMN     "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresPreConfirmation" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "AppointmentService" ADD COLUMN     "actualDuration" INTEGER,
ADD COLUMN     "estimatedDuration" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "recommendedReturnDays" INTEGER;

-- AlterTable
ALTER TABLE "spas" ADD COLUMN     "closingTime" TEXT,
ADD COLUMN     "openingTime" TEXT;

-- CreateTable
CREATE TABLE "client_service_history" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "appointmentServiceId" TEXT NOT NULL,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "recommendedReturnDate" TIMESTAMP(3) NOT NULL,
    "isNotified" BOOLEAN NOT NULL DEFAULT false,
    "notifiedAt" TIMESTAMP(3),
    "isFollowedUp" BOOLEAN NOT NULL DEFAULT false,
    "followedUpAt" TIMESTAMP(3),
    "notes" TEXT,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_service_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follow_up_notifications" (
    "id" TEXT NOT NULL,
    "clientServiceHistoryId" TEXT NOT NULL,
    "type" "FollowUpNotificationType" NOT NULL,
    "status" "FollowUpNotificationStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "message" TEXT,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "follow_up_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manicurist_schedules" (
    "id" TEXT NOT NULL,
    "manicuristId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manicurist_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manicurist_availability" (
    "id" TEXT NOT NULL,
    "manicuristId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "reason" TEXT,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manicurist_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_links" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "maxAdvanceDays" INTEGER,
    "minAdvanceHours" INTEGER,
    "allowSameDayBooking" BOOLEAN NOT NULL DEFAULT false,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT true,
    "requiresPreConfirmation" BOOLEAN NOT NULL DEFAULT true,
    "preConfirmationHours" INTEGER NOT NULL DEFAULT 24,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_link_services" (
    "id" TEXT NOT NULL,
    "bookingLinkId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_link_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_slots" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "manicuristId" TEXT,
    "appointmentId" TEXT,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manicurist_service_durations" (
    "id" TEXT NOT NULL,
    "manicuristId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "totalServices" INTEGER NOT NULL DEFAULT 0,
    "totalDuration" INTEGER NOT NULL DEFAULT 0,
    "averageDuration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minDuration" INTEGER,
    "maxDuration" INTEGER,
    "lastServiceDate" TIMESTAMP(3),
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manicurist_service_durations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_goals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SalesGoalType" NOT NULL,
    "period" "SalesGoalPeriod" NOT NULL,
    "targetAmount" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "manicuristId" TEXT,
    "serviceId" TEXT,
    "currentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_goal_progress" (
    "id" TEXT NOT NULL,
    "salesGoalId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "services" INTEGER NOT NULL DEFAULT 0,
    "clients" INTEGER NOT NULL DEFAULT 0,
    "appointments" INTEGER NOT NULL DEFAULT 0,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_goal_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment_approval_history" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "action" "ApprovalAction" NOT NULL,
    "notes" TEXT,
    "adminId" TEXT NOT NULL,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointment_approval_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pre_confirmation_reminders" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "type" "PreConfirmationReminderType" NOT NULL,
    "status" "PreConfirmationReminderStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pre_confirmation_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cash_registers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "currentBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cash_registers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cash_register_shifts" (
    "id" TEXT NOT NULL,
    "cashRegisterId" TEXT NOT NULL,
    "openedBy" TEXT NOT NULL,
    "closedBy" TEXT,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "openingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "closingBalance" DOUBLE PRECISION,
    "expectedBalance" DOUBLE PRECISION,
    "difference" DOUBLE PRECISION,
    "status" "CashRegisterShiftStatus" NOT NULL DEFAULT 'OPEN',
    "notes" TEXT,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cash_register_shifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cash_register_transactions" (
    "id" TEXT NOT NULL,
    "cashRegisterShiftId" TEXT NOT NULL,
    "paymentId" TEXT,
    "type" "CashRegisterTransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "reference" TEXT,
    "cashIn" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cashOut" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "performedBy" TEXT NOT NULL,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cash_register_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "manicurist_schedules_manicuristId_dayOfWeek_key" ON "manicurist_schedules"("manicuristId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "manicurist_availability_manicuristId_date_key" ON "manicurist_availability"("manicuristId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "booking_links_token_key" ON "booking_links"("token");

-- CreateIndex
CREATE UNIQUE INDEX "booking_link_services_bookingLinkId_serviceId_key" ON "booking_link_services"("bookingLinkId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "time_slots_date_startTime_manicuristId_key" ON "time_slots"("date", "startTime", "manicuristId");

-- CreateIndex
CREATE UNIQUE INDEX "manicurist_service_durations_manicuristId_serviceId_key" ON "manicurist_service_durations"("manicuristId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_goal_progress_salesGoalId_date_key" ON "sales_goal_progress"("salesGoalId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "cash_register_transactions_paymentId_key" ON "cash_register_transactions"("paymentId");

-- AddForeignKey
ALTER TABLE "client_service_history" ADD CONSTRAINT "client_service_history_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_service_history" ADD CONSTRAINT "client_service_history_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_service_history" ADD CONSTRAINT "client_service_history_appointmentServiceId_fkey" FOREIGN KEY ("appointmentServiceId") REFERENCES "AppointmentService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_service_history" ADD CONSTRAINT "client_service_history_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow_up_notifications" ADD CONSTRAINT "follow_up_notifications_clientServiceHistoryId_fkey" FOREIGN KEY ("clientServiceHistoryId") REFERENCES "client_service_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow_up_notifications" ADD CONSTRAINT "follow_up_notifications_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manicurist_schedules" ADD CONSTRAINT "manicurist_schedules_manicuristId_fkey" FOREIGN KEY ("manicuristId") REFERENCES "manicurists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manicurist_schedules" ADD CONSTRAINT "manicurist_schedules_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manicurist_availability" ADD CONSTRAINT "manicurist_availability_manicuristId_fkey" FOREIGN KEY ("manicuristId") REFERENCES "manicurists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manicurist_availability" ADD CONSTRAINT "manicurist_availability_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_links" ADD CONSTRAINT "booking_links_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_link_services" ADD CONSTRAINT "booking_link_services_bookingLinkId_fkey" FOREIGN KEY ("bookingLinkId") REFERENCES "booking_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_link_services" ADD CONSTRAINT "booking_link_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_link_services" ADD CONSTRAINT "booking_link_services_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_slots" ADD CONSTRAINT "time_slots_manicuristId_fkey" FOREIGN KEY ("manicuristId") REFERENCES "manicurists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_slots" ADD CONSTRAINT "time_slots_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_slots" ADD CONSTRAINT "time_slots_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manicurist_service_durations" ADD CONSTRAINT "manicurist_service_durations_manicuristId_fkey" FOREIGN KEY ("manicuristId") REFERENCES "manicurists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manicurist_service_durations" ADD CONSTRAINT "manicurist_service_durations_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manicurist_service_durations" ADD CONSTRAINT "manicurist_service_durations_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_goals" ADD CONSTRAINT "sales_goals_manicuristId_fkey" FOREIGN KEY ("manicuristId") REFERENCES "manicurists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_goals" ADD CONSTRAINT "sales_goals_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_goals" ADD CONSTRAINT "sales_goals_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_goal_progress" ADD CONSTRAINT "sales_goal_progress_salesGoalId_fkey" FOREIGN KEY ("salesGoalId") REFERENCES "sales_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_goal_progress" ADD CONSTRAINT "sales_goal_progress_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_approval_history" ADD CONSTRAINT "appointment_approval_history_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_approval_history" ADD CONSTRAINT "appointment_approval_history_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_approval_history" ADD CONSTRAINT "appointment_approval_history_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_confirmation_reminders" ADD CONSTRAINT "pre_confirmation_reminders_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_confirmation_reminders" ADD CONSTRAINT "pre_confirmation_reminders_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_registers" ADD CONSTRAINT "cash_registers_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_register_shifts" ADD CONSTRAINT "cash_register_shifts_cashRegisterId_fkey" FOREIGN KEY ("cashRegisterId") REFERENCES "cash_registers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_register_shifts" ADD CONSTRAINT "cash_register_shifts_openedBy_fkey" FOREIGN KEY ("openedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_register_shifts" ADD CONSTRAINT "cash_register_shifts_closedBy_fkey" FOREIGN KEY ("closedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_register_shifts" ADD CONSTRAINT "cash_register_shifts_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_register_transactions" ADD CONSTRAINT "cash_register_transactions_cashRegisterShiftId_fkey" FOREIGN KEY ("cashRegisterShiftId") REFERENCES "cash_register_shifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_register_transactions" ADD CONSTRAINT "cash_register_transactions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_register_transactions" ADD CONSTRAINT "cash_register_transactions_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_register_transactions" ADD CONSTRAINT "cash_register_transactions_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_bookingLinkId_fkey" FOREIGN KEY ("bookingLinkId") REFERENCES "booking_links"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_preConfirmedBy_fkey" FOREIGN KEY ("preConfirmedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

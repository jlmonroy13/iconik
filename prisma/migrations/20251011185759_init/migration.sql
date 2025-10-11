-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('SUPER_ADMIN', 'SPA_ADMIN', 'BRANCH_ADMIN', 'MANICURIST', 'CLIENT');

-- CreateEnum
CREATE TYPE "public"."ServiceType" AS ENUM ('MANICURE_PEDICURE', 'NAIL_ART', 'NAIL_EXTENSIONS', 'NAIL_MAINTENANCE', 'SPA_TREATMENTS');

-- CreateEnum
CREATE TYPE "public"."AppointmentStatus" AS ENUM ('PENDING_APPROVAL', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "public"."ServiceTimeRating" AS ENUM ('VERY_FAST', 'ADEQUATE', 'VERY_SLOW');

-- CreateEnum
CREATE TYPE "public"."CommissionStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ExpenseType" AS ENUM ('FIXED', 'VARIABLE');

-- CreateEnum
CREATE TYPE "public"."ExpenseCategory" AS ENUM ('RENT', 'SALARIES', 'MARKETING', 'SUPPLIES', 'UTILITIES', 'INSURANCE', 'MAINTENANCE', 'EQUIPMENT', 'SOFTWARE', 'PROFESSIONAL', 'TRAINING', 'TRAVEL', 'FOOD', 'CLEANING', 'SECURITY', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ExpenseFrequency" AS ENUM ('MONTHLY', 'WEEKLY', 'DAILY', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "public"."FollowUpNotificationType" AS ENUM ('EMAIL', 'SMS', 'PUSH', 'DASHBOARD');

-- CreateEnum
CREATE TYPE "public"."FollowUpNotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."SalesGoalType" AS ENUM ('REVENUE', 'SERVICES', 'CLIENTS', 'APPOINTMENTS');

-- CreateEnum
CREATE TYPE "public"."SalesGoalPeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "public"."ApprovalAction" AS ENUM ('APPROVE', 'REJECT', 'REQUEST_CHANGES');

-- CreateEnum
CREATE TYPE "public"."PreConfirmationReminderType" AS ENUM ('EMAIL', 'SMS', 'PUSH', 'DASHBOARD');

-- CreateEnum
CREATE TYPE "public"."PreConfirmationReminderStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."CashRegisterShiftStatus" AS ENUM ('OPEN', 'CLOSED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."CashRegisterTransactionType" AS ENUM ('PAYMENT_RECEIVED', 'PAYMENT_REFUND', 'CASH_DEPOSIT', 'CASH_WITHDRAWAL', 'EXPENSE_PAYMENT', 'CHANGE_GIVEN', 'OPENING_BALANCE', 'CLOSING_BALANCE', 'ADJUSTMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."InvoiceType" AS ENUM ('SALE', 'RETURN', 'ADJUSTMENT', 'CREDIT_NOTE', 'DEBIT_NOTE');

-- CreateEnum
CREATE TYPE "public"."InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'CANCELLED', 'VOIDED');

-- CreateEnum
CREATE TYPE "public"."DianStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'VOIDED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('COMPLETED', 'FAILED', 'PENDING', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "public"."BusinessType" AS ENUM ('JURIDICA', 'NATURAL');

-- CreateEnum
CREATE TYPE "public"."TaxRegime" AS ENUM ('SIMPLIFICADO', 'COMUN', 'GRAN_CONTRIBUYENTE');

-- CreateEnum
CREATE TYPE "public"."FiscalResponsibility" AS ENUM ('O_13', 'O_15', 'O_23', 'O_47', 'O_48', 'O_49', 'O_50');

-- CreateTable
CREATE TABLE "public"."spas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "logoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "openingTime" TEXT,
    "closingTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."spa_schedules" (
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

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'CLIENT',
    "spaId" TEXT,
    "branchId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "public"."Authenticator" (
    "credentialID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId","credentialID")
);

-- CreateTable
CREATE TABLE "public"."clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "birthday" TIMESTAMP(3),
    "notes" TEXT,
    "spaId" TEXT NOT NULL,
    "branchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."client_service_history" (
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
CREATE TABLE "public"."follow_up_notifications" (
    "id" TEXT NOT NULL,
    "clientServiceHistoryId" TEXT NOT NULL,
    "type" "public"."FollowUpNotificationType" NOT NULL,
    "status" "public"."FollowUpNotificationStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "message" TEXT,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "follow_up_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."manicurists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "spaId" TEXT NOT NULL,
    "branchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manicurists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."manicurist_schedules" (
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
CREATE TABLE "public"."manicurist_availability" (
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
CREATE TABLE "public"."manicurist_services" (
    "id" TEXT NOT NULL,
    "manicuristId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "spaId" TEXT NOT NULL,
    "branchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manicurist_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."booking_links" (
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
CREATE TABLE "public"."booking_link_services" (
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
CREATE TABLE "public"."time_slots" (
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
CREATE TABLE "public"."manicurist_service_durations" (
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
CREATE TABLE "public"."sales_goals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."SalesGoalType" NOT NULL,
    "period" "public"."SalesGoalPeriod" NOT NULL,
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
CREATE TABLE "public"."sales_goal_progress" (
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
CREATE TABLE "public"."appointment_approval_history" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "action" "public"."ApprovalAction" NOT NULL,
    "notes" TEXT,
    "adminId" TEXT NOT NULL,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointment_approval_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pre_confirmation_reminders" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "type" "public"."PreConfirmationReminderType" NOT NULL,
    "status" "public"."PreConfirmationReminderStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pre_confirmation_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cash_registers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "currentBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "spaId" TEXT NOT NULL,
    "branchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cash_registers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cash_register_shifts" (
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
    "status" "public"."CashRegisterShiftStatus" NOT NULL DEFAULT 'OPEN',
    "notes" TEXT,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cash_register_shifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cash_register_transactions" (
    "id" TEXT NOT NULL,
    "cashRegisterShiftId" TEXT NOT NULL,
    "paymentId" TEXT,
    "type" "public"."CashRegisterTransactionType" NOT NULL,
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

-- CreateTable
CREATE TABLE "public"."Service" (
    "id" TEXT NOT NULL,
    "type" "public"."ServiceType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "taxRate" DOUBLE PRECISION,
    "duration" INTEGER NOT NULL,
    "recommendedReturnDays" INTEGER,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "spaId" TEXT NOT NULL,
    "branchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Appointment" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "manicuristId" TEXT,
    "branchId" TEXT,
    "isScheduled" BOOLEAN NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" "public"."AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "bookingLinkId" TEXT,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvalNotes" TEXT,
    "requiresPreConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "preConfirmedBy" TEXT,
    "preConfirmedAt" TIMESTAMP(3),
    "preConfirmationNotes" TEXT,
    "preConfirmationReminderSent" BOOLEAN NOT NULL DEFAULT false,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AppointmentService" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "manicuristId" TEXT NOT NULL,
    "startedAtByManicurist" TIMESTAMP(3),
    "endedAtByManicurist" TIMESTAMP(3),
    "startedAtByAdmin" TIMESTAMP(3),
    "endedAtByAdmin" TIMESTAMP(3),
    "estimatedDuration" INTEGER NOT NULL,
    "actualDuration" INTEGER,
    "durationAvg" INTEGER,
    "price" DOUBLE PRECISION NOT NULL,
    "taxRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentMethod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "icon" TEXT,
    "transactionFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT,
    "appointmentServiceId" TEXT,
    "paymentMethodId" TEXT NOT NULL,
    "branchId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT,
    "originalAmount" DOUBLE PRECISION NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountReason" TEXT,
    "discountAffectsCommission" BOOLEAN NOT NULL DEFAULT false,
    "transactionFeeAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "transactionFeeRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Commission" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "manicuristId" TEXT NOT NULL,
    "serviceAmount" DOUBLE PRECISION NOT NULL,
    "commissionRate" DOUBLE PRECISION NOT NULL,
    "commissionAmount" DOUBLE PRECISION NOT NULL,
    "spaAmount" DOUBLE PRECISION NOT NULL,
    "status" "public"."CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "originalCommissionAmount" DOUBLE PRECISION NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountAffectsCommission" BOOLEAN NOT NULL DEFAULT false,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Feedback" (
    "id" TEXT NOT NULL,
    "appointmentServiceId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "serviceTimeRating" "public"."ServiceTimeRating" NOT NULL,
    "workQualityRating" INTEGER NOT NULL,
    "manicuristAttentionRating" INTEGER NOT NULL,
    "spaAdminAttentionRating" INTEGER NOT NULL,
    "comment" TEXT,
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Expense" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "public"."ExpenseType" NOT NULL,
    "category" "public"."ExpenseCategory" NOT NULL,
    "frequency" "public"."ExpenseFrequency" NOT NULL,
    "dueDate" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExpensePayment" (
    "id" TEXT NOT NULL,
    "expenseId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethodId" TEXT NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpensePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."spa_dian_settings" (
    "id" TEXT NOT NULL,
    "spaId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessType" "public"."BusinessType" NOT NULL,
    "taxId" TEXT NOT NULL,
    "taxIdDV" VARCHAR(1) NOT NULL,
    "taxRegime" "public"."TaxRegime" NOT NULL,
    "fiscalResponsibility" "public"."FiscalResponsibility" NOT NULL,
    "additionalFiscalResponsibility" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL DEFAULT 'CO',
    "postalCode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "invoicePrefix" TEXT NOT NULL DEFAULT 'FAC',
    "invoiceStartNumber" INTEGER NOT NULL DEFAULT 1,
    "currentInvoiceNumber" INTEGER NOT NULL DEFAULT 0,
    "dianTestMode" BOOLEAN NOT NULL DEFAULT true,
    "dianUsername" TEXT,
    "dianPassword" TEXT,
    "dianCertificate" TEXT,
    "dianCertificatePassword" TEXT,
    "defaultTaxRate" DOUBLE PRECISION NOT NULL DEFAULT 0.19,
    "exemptTaxRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "allowDiscounts" BOOLEAN NOT NULL DEFAULT true,
    "maxDiscountPercent" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "defaultPaymentTerms" TEXT NOT NULL DEFAULT 'CONTADO',
    "allowPartialPayments" BOOLEAN NOT NULL DEFAULT true,
    "defaultNotes" TEXT,
    "footerText" TEXT,
    "logoUrl" TEXT,
    "signatureUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spa_dian_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invoices" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceType" "public"."InvoiceType" NOT NULL DEFAULT 'SALE',
    "invoiceStatus" "public"."InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "clientId" TEXT,
    "clientName" TEXT NOT NULL,
    "clientTaxId" TEXT,
    "clientTaxIdDV" TEXT,
    "clientAddress" TEXT,
    "clientPhone" TEXT,
    "clientEmail" TEXT,
    "spaId" TEXT NOT NULL,
    "branchId" TEXT,
    "spaName" TEXT NOT NULL,
    "spaTaxId" TEXT NOT NULL,
    "spaAddress" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paymentTerms" TEXT NOT NULL DEFAULT 'CONTADO',
    "paymentMethod" TEXT,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balanceAmount" DOUBLE PRECISION NOT NULL,
    "dianStatus" "public"."DianStatus" NOT NULL DEFAULT 'PENDING',
    "dianResponse" TEXT,
    "dianErrors" TEXT,
    "dianCufe" TEXT,
    "dianQrCode" TEXT,
    "dianPdfUrl" TEXT,
    "pdfUrl" TEXT,
    "xmlUrl" TEXT,
    "notes" TEXT,
    "publicNotes" TEXT,
    "footerText" TEXT,
    "createdBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invoice_items" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "serviceId" TEXT,
    "itemName" TEXT NOT NULL,
    "itemDescription" TEXT,
    "itemCode" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "unitMeasure" TEXT NOT NULL DEFAULT 'UNIDAD',
    "subtotal" DOUBLE PRECISION NOT NULL,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0.19,
    "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxType" TEXT NOT NULL DEFAULT 'IVA',
    "discountRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invoice_payments" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "paymentId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT,
    "transactionId" TEXT,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'COMPLETED',
    "notes" TEXT,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dian_logs" (
    "id" TEXT NOT NULL,
    "operationType" TEXT NOT NULL,
    "invoiceId" TEXT,
    "requestData" TEXT NOT NULL,
    "requestTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseData" TEXT,
    "responseTimestamp" TIMESTAMP(3),
    "responseStatus" TEXT,
    "responseCode" TEXT,
    "errorMessage" TEXT,
    "errorCode" TEXT,
    "errorDetails" TEXT,
    "isTestMode" BOOLEAN NOT NULL DEFAULT true,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dian_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."branches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "openingTime" TEXT,
    "closingTime" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "invoicePrefix" TEXT,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."spa_corporate_settings" (
    "id" TEXT NOT NULL,
    "spaId" TEXT NOT NULL,
    "enableCorporateClients" BOOLEAN NOT NULL DEFAULT true,
    "allowCrossBranchAppointments" BOOLEAN NOT NULL DEFAULT true,
    "requireBranchSelection" BOOLEAN NOT NULL DEFAULT true,
    "corporateInvoicePrefix" TEXT NOT NULL DEFAULT 'FAC-CORP',
    "enableConsolidatedInvoicing" BOOLEAN NOT NULL DEFAULT false,
    "enableCrossBranchReports" BOOLEAN NOT NULL DEFAULT true,
    "enableBranchComparison" BOOLEAN NOT NULL DEFAULT true,
    "allowBranchSpecificSettings" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spa_corporate_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."branch_settings" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "customInvoicePrefix" TEXT,
    "customTaxRate" DOUBLE PRECISION,
    "customOperatingHours" BOOLEAN NOT NULL DEFAULT false,
    "enableAllServices" BOOLEAN NOT NULL DEFAULT true,
    "restrictedServices" TEXT[],
    "enableAllManicurists" BOOLEAN NOT NULL DEFAULT true,
    "restrictedManicurists" TEXT[],
    "allowNewClients" BOOLEAN NOT NULL DEFAULT true,
    "allowWalkIns" BOOLEAN NOT NULL DEFAULT true,
    "allowedPaymentMethods" TEXT[],
    "useSpaDianSettings" BOOLEAN NOT NULL DEFAULT true,
    "customDianSettings" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "spas_slug_key" ON "public"."spas"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "spa_schedules_spaId_dayOfWeek_isHoliday_key" ON "public"."spa_schedules"("spaId", "dayOfWeek", "isHoliday");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "public"."Authenticator"("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "manicurist_schedules_manicuristId_dayOfWeek_key" ON "public"."manicurist_schedules"("manicuristId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "manicurist_availability_manicuristId_date_key" ON "public"."manicurist_availability"("manicuristId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "manicurist_services_manicuristId_serviceId_key" ON "public"."manicurist_services"("manicuristId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "booking_links_token_key" ON "public"."booking_links"("token");

-- CreateIndex
CREATE UNIQUE INDEX "booking_link_services_bookingLinkId_serviceId_key" ON "public"."booking_link_services"("bookingLinkId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "time_slots_date_startTime_manicuristId_key" ON "public"."time_slots"("date", "startTime", "manicuristId");

-- CreateIndex
CREATE UNIQUE INDEX "manicurist_service_durations_manicuristId_serviceId_key" ON "public"."manicurist_service_durations"("manicuristId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_goal_progress_salesGoalId_date_key" ON "public"."sales_goal_progress"("salesGoalId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "cash_register_transactions_paymentId_key" ON "public"."cash_register_transactions"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Commission_paymentId_key" ON "public"."Commission"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_appointmentServiceId_key" ON "public"."Feedback"("appointmentServiceId");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_token_key" ON "public"."Feedback"("token");

-- CreateIndex
CREATE UNIQUE INDEX "spa_dian_settings_spaId_key" ON "public"."spa_dian_settings"("spaId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "public"."invoices"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "branches_spaId_code_key" ON "public"."branches"("spaId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "spa_corporate_settings_spaId_key" ON "public"."spa_corporate_settings"("spaId");

-- CreateIndex
CREATE UNIQUE INDEX "branch_settings_branchId_key" ON "public"."branch_settings"("branchId");

-- AddForeignKey
ALTER TABLE "public"."spa_schedules" ADD CONSTRAINT "spa_schedules_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clients" ADD CONSTRAINT "clients_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clients" ADD CONSTRAINT "clients_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."client_service_history" ADD CONSTRAINT "client_service_history_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."client_service_history" ADD CONSTRAINT "client_service_history_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."client_service_history" ADD CONSTRAINT "client_service_history_appointmentServiceId_fkey" FOREIGN KEY ("appointmentServiceId") REFERENCES "public"."AppointmentService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."client_service_history" ADD CONSTRAINT "client_service_history_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follow_up_notifications" ADD CONSTRAINT "follow_up_notifications_clientServiceHistoryId_fkey" FOREIGN KEY ("clientServiceHistoryId") REFERENCES "public"."client_service_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follow_up_notifications" ADD CONSTRAINT "follow_up_notifications_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manicurists" ADD CONSTRAINT "manicurists_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manicurists" ADD CONSTRAINT "manicurists_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manicurist_schedules" ADD CONSTRAINT "manicurist_schedules_manicuristId_fkey" FOREIGN KEY ("manicuristId") REFERENCES "public"."manicurists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manicurist_schedules" ADD CONSTRAINT "manicurist_schedules_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manicurist_availability" ADD CONSTRAINT "manicurist_availability_manicuristId_fkey" FOREIGN KEY ("manicuristId") REFERENCES "public"."manicurists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manicurist_availability" ADD CONSTRAINT "manicurist_availability_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manicurist_services" ADD CONSTRAINT "manicurist_services_manicuristId_fkey" FOREIGN KEY ("manicuristId") REFERENCES "public"."manicurists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manicurist_services" ADD CONSTRAINT "manicurist_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manicurist_services" ADD CONSTRAINT "manicurist_services_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manicurist_services" ADD CONSTRAINT "manicurist_services_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking_links" ADD CONSTRAINT "booking_links_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking_link_services" ADD CONSTRAINT "booking_link_services_bookingLinkId_fkey" FOREIGN KEY ("bookingLinkId") REFERENCES "public"."booking_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking_link_services" ADD CONSTRAINT "booking_link_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking_link_services" ADD CONSTRAINT "booking_link_services_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."time_slots" ADD CONSTRAINT "time_slots_manicuristId_fkey" FOREIGN KEY ("manicuristId") REFERENCES "public"."manicurists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."time_slots" ADD CONSTRAINT "time_slots_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."time_slots" ADD CONSTRAINT "time_slots_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manicurist_service_durations" ADD CONSTRAINT "manicurist_service_durations_manicuristId_fkey" FOREIGN KEY ("manicuristId") REFERENCES "public"."manicurists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manicurist_service_durations" ADD CONSTRAINT "manicurist_service_durations_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manicurist_service_durations" ADD CONSTRAINT "manicurist_service_durations_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sales_goals" ADD CONSTRAINT "sales_goals_manicuristId_fkey" FOREIGN KEY ("manicuristId") REFERENCES "public"."manicurists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sales_goals" ADD CONSTRAINT "sales_goals_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sales_goals" ADD CONSTRAINT "sales_goals_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sales_goal_progress" ADD CONSTRAINT "sales_goal_progress_salesGoalId_fkey" FOREIGN KEY ("salesGoalId") REFERENCES "public"."sales_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sales_goal_progress" ADD CONSTRAINT "sales_goal_progress_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."appointment_approval_history" ADD CONSTRAINT "appointment_approval_history_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."appointment_approval_history" ADD CONSTRAINT "appointment_approval_history_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."appointment_approval_history" ADD CONSTRAINT "appointment_approval_history_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pre_confirmation_reminders" ADD CONSTRAINT "pre_confirmation_reminders_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pre_confirmation_reminders" ADD CONSTRAINT "pre_confirmation_reminders_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cash_registers" ADD CONSTRAINT "cash_registers_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cash_registers" ADD CONSTRAINT "cash_registers_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cash_register_shifts" ADD CONSTRAINT "cash_register_shifts_cashRegisterId_fkey" FOREIGN KEY ("cashRegisterId") REFERENCES "public"."cash_registers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cash_register_shifts" ADD CONSTRAINT "cash_register_shifts_openedBy_fkey" FOREIGN KEY ("openedBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cash_register_shifts" ADD CONSTRAINT "cash_register_shifts_closedBy_fkey" FOREIGN KEY ("closedBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cash_register_shifts" ADD CONSTRAINT "cash_register_shifts_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cash_register_transactions" ADD CONSTRAINT "cash_register_transactions_cashRegisterShiftId_fkey" FOREIGN KEY ("cashRegisterShiftId") REFERENCES "public"."cash_register_shifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cash_register_transactions" ADD CONSTRAINT "cash_register_transactions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cash_register_transactions" ADD CONSTRAINT "cash_register_transactions_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cash_register_transactions" ADD CONSTRAINT "cash_register_transactions_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Service" ADD CONSTRAINT "Service_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Service" ADD CONSTRAINT "Service_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_manicuristId_fkey" FOREIGN KEY ("manicuristId") REFERENCES "public"."manicurists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_bookingLinkId_fkey" FOREIGN KEY ("bookingLinkId") REFERENCES "public"."booking_links"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_preConfirmedBy_fkey" FOREIGN KEY ("preConfirmedBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentService" ADD CONSTRAINT "AppointmentService_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentService" ADD CONSTRAINT "AppointmentService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentService" ADD CONSTRAINT "AppointmentService_manicuristId_fkey" FOREIGN KEY ("manicuristId") REFERENCES "public"."manicurists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentMethod" ADD CONSTRAINT "PaymentMethod_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_appointmentServiceId_fkey" FOREIGN KEY ("appointmentServiceId") REFERENCES "public"."AppointmentService"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "public"."PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Commission" ADD CONSTRAINT "Commission_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Commission" ADD CONSTRAINT "Commission_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Commission" ADD CONSTRAINT "Commission_manicuristId_fkey" FOREIGN KEY ("manicuristId") REFERENCES "public"."manicurists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Feedback" ADD CONSTRAINT "Feedback_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Feedback" ADD CONSTRAINT "Feedback_appointmentServiceId_fkey" FOREIGN KEY ("appointmentServiceId") REFERENCES "public"."AppointmentService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Expense" ADD CONSTRAINT "Expense_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExpensePayment" ADD CONSTRAINT "ExpensePayment_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "public"."Expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExpensePayment" ADD CONSTRAINT "ExpensePayment_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "public"."PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExpensePayment" ADD CONSTRAINT "ExpensePayment_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."spa_dian_settings" ADD CONSTRAINT "spa_dian_settings_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice_items" ADD CONSTRAINT "invoice_items_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice_items" ADD CONSTRAINT "invoice_items_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice_payments" ADD CONSTRAINT "invoice_payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice_payments" ADD CONSTRAINT "invoice_payments_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice_payments" ADD CONSTRAINT "invoice_payments_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dian_logs" ADD CONSTRAINT "dian_logs_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dian_logs" ADD CONSTRAINT "dian_logs_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."branches" ADD CONSTRAINT "branches_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."spa_corporate_settings" ADD CONSTRAINT "spa_corporate_settings_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "public"."spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."branch_settings" ADD CONSTRAINT "branch_settings_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

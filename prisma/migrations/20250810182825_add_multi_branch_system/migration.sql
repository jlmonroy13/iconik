-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MANICURIST', 'CLIENT');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('MANICURE', 'PEDICURE', 'NAIL_ART', 'GEL_POLISH', 'ACRYLIC_NAILS', 'NAIL_REPAIR', 'HAND_SPA', 'FOOT_SPA', 'OTHER');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING_APPROVAL', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "ServiceTimeRating" AS ENUM ('VERY_FAST', 'ADEQUATE', 'VERY_SLOW');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('FIXED', 'VARIABLE');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('RENT', 'SALARIES', 'MARKETING', 'SUPPLIES', 'UTILITIES', 'INSURANCE', 'MAINTENANCE', 'EQUIPMENT', 'SOFTWARE', 'PROFESSIONAL', 'TRAINING', 'TRAVEL', 'FOOD', 'CLEANING', 'SECURITY', 'OTHER');

-- CreateEnum
CREATE TYPE "ExpenseFrequency" AS ENUM ('MONTHLY', 'WEEKLY', 'DAILY', 'ONE_TIME');

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

-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('SALE', 'RETURN', 'ADJUSTMENT', 'CREDIT_NOTE', 'DEBIT_NOTE');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'CANCELLED', 'VOIDED');

-- CreateEnum
CREATE TYPE "DianStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'VOIDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('COMPLETED', 'FAILED', 'PENDING', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('JURIDICA', 'NATURAL');

-- CreateEnum
CREATE TYPE "TaxRegime" AS ENUM ('SIMPLIFICADO', 'COMUN', 'GRAN_CONTRIBUYENTE');

-- CreateEnum
CREATE TYPE "FiscalResponsibility" AS ENUM ('O_13', 'O_15', 'O_23', 'O_47', 'O_48', 'O_49', 'O_50', 'O_51', 'O_52', 'O_53', 'O_54', 'O_55', 'O_56', 'O_57', 'O_58', 'O_59', 'O_60', 'O_61', 'O_62', 'O_63', 'O_64', 'O_65', 'O_66', 'O_67', 'O_68', 'O_69', 'O_70', 'O_71', 'O_72', 'O_73', 'O_74', 'O_75', 'O_76', 'O_77', 'O_78', 'O_79', 'O_80', 'O_81', 'O_82', 'O_83', 'O_84', 'O_85', 'O_86', 'O_87', 'O_88', 'O_89', 'O_90', 'O_91', 'O_92', 'O_93', 'O_94', 'O_95', 'O_96', 'O_97', 'O_98', 'O_99');

-- CreateTable
CREATE TABLE "spas" (
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

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "spaId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
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
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Authenticator" (
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
CREATE TABLE "clients" (
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
CREATE TABLE "manicurists" (
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
    "branchId" TEXT,
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

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "type" "ServiceType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "kitCost" DOUBLE PRECISION,
    "taxRate" DOUBLE PRECISION,
    "duration" INTEGER NOT NULL,
    "recommendedReturnDays" INTEGER,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "spaId" TEXT NOT NULL,
    "branchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "manicuristId" TEXT,
    "branchId" TEXT NOT NULL,
    "isScheduled" BOOLEAN NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
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
CREATE TABLE "AppointmentService" (
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
    "kitCost" DOUBLE PRECISION,
    "taxRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
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
CREATE TABLE "Payment" (
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
CREATE TABLE "Commission" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "manicuristId" TEXT NOT NULL,
    "serviceAmount" DOUBLE PRECISION NOT NULL,
    "commissionRate" DOUBLE PRECISION NOT NULL,
    "commissionAmount" DOUBLE PRECISION NOT NULL,
    "spaAmount" DOUBLE PRECISION NOT NULL,
    "status" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "originalCommissionAmount" DOUBLE PRECISION NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountAffectsCommission" BOOLEAN NOT NULL DEFAULT false,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "appointmentServiceId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "serviceTimeRating" "ServiceTimeRating" NOT NULL,
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
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "ExpenseType" NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "frequency" "ExpenseFrequency" NOT NULL,
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
CREATE TABLE "ExpensePayment" (
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
CREATE TABLE "spa_dian_settings" (
    "id" TEXT NOT NULL,
    "spaId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessType" "BusinessType" NOT NULL,
    "taxId" TEXT NOT NULL,
    "taxIdDV" VARCHAR(1) NOT NULL,
    "taxRegime" "TaxRegime" NOT NULL,
    "fiscalResponsibility" "FiscalResponsibility" NOT NULL,
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
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceType" "InvoiceType" NOT NULL DEFAULT 'SALE',
    "invoiceStatus" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
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
    "dianStatus" "DianStatus" NOT NULL DEFAULT 'PENDING',
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
CREATE TABLE "invoice_items" (
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
CREATE TABLE "invoice_payments" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "paymentId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT,
    "transactionId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'COMPLETED',
    "notes" TEXT,
    "spaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dian_logs" (
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
CREATE TABLE "branches" (
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
CREATE TABLE "spa_corporate_settings" (
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
CREATE TABLE "branch_settings" (
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
CREATE UNIQUE INDEX "spas_slug_key" ON "spas"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "spa_schedules_spaId_dayOfWeek_isHoliday_key" ON "spa_schedules"("spaId", "dayOfWeek", "isHoliday");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "Authenticator"("credentialID");

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

-- CreateIndex
CREATE UNIQUE INDEX "Commission_paymentId_key" ON "Commission"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_appointmentServiceId_key" ON "Feedback"("appointmentServiceId");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_token_key" ON "Feedback"("token");

-- CreateIndex
CREATE UNIQUE INDEX "spa_dian_settings_spaId_key" ON "spa_dian_settings"("spaId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "branches_spaId_code_key" ON "branches"("spaId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "spa_corporate_settings_spaId_key" ON "spa_corporate_settings"("spaId");

-- CreateIndex
CREATE UNIQUE INDEX "branch_settings_branchId_key" ON "branch_settings"("branchId");

-- AddForeignKey
ALTER TABLE "spa_schedules" ADD CONSTRAINT "spa_schedules_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "manicurists" ADD CONSTRAINT "manicurists_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manicurists" ADD CONSTRAINT "manicurists_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "cash_registers" ADD CONSTRAINT "cash_registers_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "Service" ADD CONSTRAINT "Service_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_manicuristId_fkey" FOREIGN KEY ("manicuristId") REFERENCES "manicurists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_bookingLinkId_fkey" FOREIGN KEY ("bookingLinkId") REFERENCES "booking_links"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_preConfirmedBy_fkey" FOREIGN KEY ("preConfirmedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_manicuristId_fkey" FOREIGN KEY ("manicuristId") REFERENCES "manicurists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_appointmentServiceId_fkey" FOREIGN KEY ("appointmentServiceId") REFERENCES "AppointmentService"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_manicuristId_fkey" FOREIGN KEY ("manicuristId") REFERENCES "manicurists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_appointmentServiceId_fkey" FOREIGN KEY ("appointmentServiceId") REFERENCES "AppointmentService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpensePayment" ADD CONSTRAINT "ExpensePayment_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpensePayment" ADD CONSTRAINT "ExpensePayment_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpensePayment" ADD CONSTRAINT "ExpensePayment_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spa_dian_settings" ADD CONSTRAINT "spa_dian_settings_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_payments" ADD CONSTRAINT "invoice_payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_payments" ADD CONSTRAINT "invoice_payments_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_payments" ADD CONSTRAINT "invoice_payments_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dian_logs" ADD CONSTRAINT "dian_logs_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dian_logs" ADD CONSTRAINT "dian_logs_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spa_corporate_settings" ADD CONSTRAINT "spa_corporate_settings_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "spas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_settings" ADD CONSTRAINT "branch_settings_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

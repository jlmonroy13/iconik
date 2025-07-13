-- Alter the column type to DOUBLE PRECISION (float)
ALTER TABLE "PaymentMethod" ALTER COLUMN "transactionFee" TYPE DOUBLE PRECISION USING "transactionFee"::double precision;

-- Update existing data: if transactionFee is 0, set to 0.1 (10%) as a safe default
UPDATE "PaymentMethod" SET "transactionFee" = 0.1 WHERE "transactionFee" = 0;

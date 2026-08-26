-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "clientEmail" TEXT,
ADD COLUMN     "lastReminderSentAt" TIMESTAMP(3);

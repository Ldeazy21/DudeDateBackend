/*
  Warnings:

  - You are about to drop the column `account_number` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `account_title` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `bank_name` on the `event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event" DROP COLUMN "account_number",
DROP COLUMN "account_title",
DROP COLUMN "bank_name",
ADD COLUMN     "payment_detail" TEXT,
ADD COLUMN     "phone_number" TEXT;

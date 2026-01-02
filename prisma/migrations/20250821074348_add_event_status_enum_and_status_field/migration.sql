-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDING', 'PAID');

-- AlterTable
ALTER TABLE "event" ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'PENDING';

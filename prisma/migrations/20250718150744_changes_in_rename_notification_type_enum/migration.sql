/*
  Warnings:

  - Changed the type of `type` on the `notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EVENT', 'MATCH_SCHEDULE', 'INVITATION');

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL;

-- DropEnum
DROP TYPE "Notification_Type";

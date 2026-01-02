-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'ANNOUCEMENT';

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "annoucement_id" TEXT;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_annoucement_id_fkey" FOREIGN KEY ("annoucement_id") REFERENCES "annoucements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

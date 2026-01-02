-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "team_inivitation_id" TEXT;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_team_inivitation_id_fkey" FOREIGN KEY ("team_inivitation_id") REFERENCES "team_invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

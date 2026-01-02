/*
  Warnings:

  - You are about to drop the column `team_inivitation_id` on the `notifications` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_team_inivitation_id_fkey";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "team_inivitation_id",
ADD COLUMN     "team_invitation_id" TEXT;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_team_invitation_id_fkey" FOREIGN KEY ("team_invitation_id") REFERENCES "team_invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

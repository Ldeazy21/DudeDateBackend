/*
  Warnings:

  - You are about to drop the column `tema_member_role` on the `team_members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "team_members" DROP COLUMN "tema_member_role",
ADD COLUMN     "team_member_role" "TeamMemberRole" NOT NULL DEFAULT 'PLAYER';

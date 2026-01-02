/*
  Warnings:

  - You are about to drop the `_match_schedule_from_first_team_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_match_schedule_from_second_team_members` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_match_schedule_from_first_team_members" DROP CONSTRAINT "_match_schedule_from_first_team_members_A_fkey";

-- DropForeignKey
ALTER TABLE "_match_schedule_from_first_team_members" DROP CONSTRAINT "_match_schedule_from_first_team_members_B_fkey";

-- DropForeignKey
ALTER TABLE "_match_schedule_from_second_team_members" DROP CONSTRAINT "_match_schedule_from_second_team_members_A_fkey";

-- DropForeignKey
ALTER TABLE "_match_schedule_from_second_team_members" DROP CONSTRAINT "_match_schedule_from_second_team_members_B_fkey";

-- DropTable
DROP TABLE "_match_schedule_from_first_team_members";

-- DropTable
DROP TABLE "_match_schedule_from_second_team_members";

-- AddForeignKey
ALTER TABLE "match_schedule_team_member" ADD CONSTRAINT "match_schedule_team_member_first_team_member_id_fkey" FOREIGN KEY ("first_team_member_id") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_schedule_team_member" ADD CONSTRAINT "match_schedule_team_member_second_team_member_id_fkey" FOREIGN KEY ("second_team_member_id") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

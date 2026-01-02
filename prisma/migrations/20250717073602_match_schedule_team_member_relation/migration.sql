/*
  Warnings:

  - You are about to drop the column `team_member_id` on the `match_schedule_team_member` table. All the data in the column will be lost.
  - Added the required column `first_team_member_id` to the `match_schedule_team_member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `second_team_member_id` to the `match_schedule_team_member` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "match_schedule_team_member" DROP CONSTRAINT "match_schedule_team_member_team_member_id_fkey";

-- AlterTable
ALTER TABLE "match_schedule_team_member" DROP COLUMN "team_member_id",
ADD COLUMN     "first_team_member_id" TEXT NOT NULL,
ADD COLUMN     "second_team_member_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "match_schedule_team_member" ADD CONSTRAINT "match_schedule_team_member_first_team_member_id_fkey" FOREIGN KEY ("first_team_member_id") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_schedule_team_member" ADD CONSTRAINT "match_schedule_team_member_second_team_member_id_fkey" FOREIGN KEY ("second_team_member_id") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

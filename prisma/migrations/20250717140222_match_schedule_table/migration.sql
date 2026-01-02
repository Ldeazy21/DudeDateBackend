/*
  Warnings:

  - You are about to drop the column `first_team_member_id` on the `match_schedule_team_member` table. All the data in the column will be lost.
  - You are about to drop the column `second_team_member_id` on the `match_schedule_team_member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "match_schedule_team_member" DROP COLUMN "first_team_member_id",
DROP COLUMN "second_team_member_id";

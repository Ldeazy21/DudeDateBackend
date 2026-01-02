/*
  Warnings:

  - You are about to drop the column `attendance_status` on the `match_schedule_team_member` table. All the data in the column will be lost.
  - You are about to drop the column `team_role` on the `match_schedule_team_member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "match_schedule_team_member" DROP COLUMN "attendance_status",
DROP COLUMN "team_role";

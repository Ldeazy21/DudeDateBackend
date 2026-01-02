/*
  Warnings:

  - You are about to drop the column `first_team_name` on the `match_schedule` table. All the data in the column will be lost.
  - You are about to drop the column `second_team_name` on the `match_schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "match_schedule" DROP COLUMN "first_team_name",
DROP COLUMN "second_team_name";

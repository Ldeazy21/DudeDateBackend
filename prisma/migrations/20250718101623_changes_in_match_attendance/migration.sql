/*
  Warnings:

  - You are about to drop the `_first_team_match_attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_second_team_match_attendance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_first_team_match_attendance" DROP CONSTRAINT "_first_team_match_attendance_A_fkey";

-- DropForeignKey
ALTER TABLE "_first_team_match_attendance" DROP CONSTRAINT "_first_team_match_attendance_B_fkey";

-- DropForeignKey
ALTER TABLE "_second_team_match_attendance" DROP CONSTRAINT "_second_team_match_attendance_A_fkey";

-- DropForeignKey
ALTER TABLE "_second_team_match_attendance" DROP CONSTRAINT "_second_team_match_attendance_B_fkey";

-- AlterTable
ALTER TABLE "match_attendance" ADD COLUMN     "first_team_member_id" TEXT,
ADD COLUMN     "second_team_member_id" TEXT;

-- DropTable
DROP TABLE "_first_team_match_attendance";

-- DropTable
DROP TABLE "_second_team_match_attendance";

-- AddForeignKey
ALTER TABLE "match_attendance" ADD CONSTRAINT "match_attendance_first_team_member_id_fkey" FOREIGN KEY ("first_team_member_id") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_attendance" ADD CONSTRAINT "match_attendance_second_team_member_id_fkey" FOREIGN KEY ("second_team_member_id") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

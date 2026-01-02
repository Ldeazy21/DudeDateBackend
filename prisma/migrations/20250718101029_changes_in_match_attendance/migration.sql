/*
  Warnings:

  - You are about to drop the column `first_team_member_id` on the `match_attendance` table. All the data in the column will be lost.
  - You are about to drop the column `second_team_member_id` on the `match_attendance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "match_attendance" DROP CONSTRAINT "match_attendance_first_team_member_id_fkey";

-- DropForeignKey
ALTER TABLE "match_attendance" DROP CONSTRAINT "match_attendance_second_team_member_id_fkey";

-- AlterTable
ALTER TABLE "match_attendance" DROP COLUMN "first_team_member_id",
DROP COLUMN "second_team_member_id";

-- CreateTable
CREATE TABLE "_first_team_match_attendance" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_first_team_match_attendance_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_second_team_match_attendance" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_second_team_match_attendance_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_first_team_match_attendance_B_index" ON "_first_team_match_attendance"("B");

-- CreateIndex
CREATE INDEX "_second_team_match_attendance_B_index" ON "_second_team_match_attendance"("B");

-- AddForeignKey
ALTER TABLE "_first_team_match_attendance" ADD CONSTRAINT "_first_team_match_attendance_A_fkey" FOREIGN KEY ("A") REFERENCES "match_attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_first_team_match_attendance" ADD CONSTRAINT "_first_team_match_attendance_B_fkey" FOREIGN KEY ("B") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_second_team_match_attendance" ADD CONSTRAINT "_second_team_match_attendance_A_fkey" FOREIGN KEY ("A") REFERENCES "match_attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_second_team_match_attendance" ADD CONSTRAINT "_second_team_match_attendance_B_fkey" FOREIGN KEY ("B") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

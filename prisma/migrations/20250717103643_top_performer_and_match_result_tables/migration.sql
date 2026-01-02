/*
  Warnings:

  - You are about to drop the column `top_performer_first_team_member_id` on the `top_performer` table. All the data in the column will be lost.
  - You are about to drop the column `top_performer_second_team_member_id` on the `top_performer` table. All the data in the column will be lost.
  - Added the required column `first_team_member_id` to the `top_performer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `second_team_member_id` to the `top_performer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "top_performer" DROP CONSTRAINT "top_performer_top_performer_first_team_member_id_fkey";

-- DropForeignKey
ALTER TABLE "top_performer" DROP CONSTRAINT "top_performer_top_performer_second_team_member_id_fkey";

-- AlterTable
ALTER TABLE "top_performer" DROP COLUMN "top_performer_first_team_member_id",
DROP COLUMN "top_performer_second_team_member_id",
ADD COLUMN     "first_team_member_id" TEXT NOT NULL,
ADD COLUMN     "second_team_member_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "top_performer" ADD CONSTRAINT "top_performer_first_team_member_id_fkey" FOREIGN KEY ("first_team_member_id") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "top_performer" ADD CONSTRAINT "top_performer_second_team_member_id_fkey" FOREIGN KEY ("second_team_member_id") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

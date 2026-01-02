/*
  Warnings:

  - You are about to drop the column `member_id` on the `team_members` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `team_members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_member_id_fkey";

-- AlterTable
ALTER TABLE "team_members" DROP COLUMN "member_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

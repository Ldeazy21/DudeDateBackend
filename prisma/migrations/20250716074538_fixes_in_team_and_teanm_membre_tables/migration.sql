/*
  Warnings:

  - You are about to drop the column `user_id` on the `team_members` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `teams` table. All the data in the column will be lost.
  - Added the required column `member_id` to the `team_members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_user_id_fkey";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_user_id_fkey";

-- AlterTable
ALTER TABLE "team_members" DROP COLUMN "user_id",
ADD COLUMN     "member_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "user_id",
ADD COLUMN     "owner_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

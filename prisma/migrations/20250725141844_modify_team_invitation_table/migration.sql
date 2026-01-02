/*
  Warnings:

  - You are about to drop the column `invited_by_id` on the `team_invitations` table. All the data in the column will be lost.
  - Added the required column `receiver_id` to the `team_invitations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "team_invitations" DROP CONSTRAINT "team_invitations_invited_by_id_fkey";

-- AlterTable
ALTER TABLE "team_invitations" DROP COLUMN "invited_by_id",
ADD COLUMN     "receiver_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "team_invitations" ADD CONSTRAINT "team_invitations_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

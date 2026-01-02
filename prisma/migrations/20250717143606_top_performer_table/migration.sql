/*
  Warnings:

  - You are about to drop the column `team_id` on the `top_performer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "top_performer" DROP CONSTRAINT "top_performer_first_team_member_id_fkey";

-- DropForeignKey
ALTER TABLE "top_performer" DROP CONSTRAINT "top_performer_second_team_member_id_fkey";

-- DropForeignKey
ALTER TABLE "top_performer" DROP CONSTRAINT "top_performer_team_id_fkey";

-- AlterTable
ALTER TABLE "top_performer" DROP COLUMN "team_id";

-- CreateTable
CREATE TABLE "_top_performer_first_team" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_top_performer_first_team_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_top_performer_second_team" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_top_performer_second_team_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_top_performer_first_team_B_index" ON "_top_performer_first_team"("B");

-- CreateIndex
CREATE INDEX "_top_performer_second_team_B_index" ON "_top_performer_second_team"("B");

-- AddForeignKey
ALTER TABLE "_top_performer_first_team" ADD CONSTRAINT "_top_performer_first_team_A_fkey" FOREIGN KEY ("A") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_top_performer_first_team" ADD CONSTRAINT "_top_performer_first_team_B_fkey" FOREIGN KEY ("B") REFERENCES "top_performer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_top_performer_second_team" ADD CONSTRAINT "_top_performer_second_team_A_fkey" FOREIGN KEY ("A") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_top_performer_second_team" ADD CONSTRAINT "_top_performer_second_team_B_fkey" FOREIGN KEY ("B") REFERENCES "top_performer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

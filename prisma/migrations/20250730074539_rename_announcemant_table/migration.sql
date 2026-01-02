/*
  Warnings:

  - You are about to drop the `_AnnoucementToTeam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AnnoucementToTeam" DROP CONSTRAINT "_AnnoucementToTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_AnnoucementToTeam" DROP CONSTRAINT "_AnnoucementToTeam_B_fkey";

-- DropTable
DROP TABLE "_AnnoucementToTeam";

-- CreateTable
CREATE TABLE "_AnnouncementToTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AnnouncementToTeam_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AnnouncementToTeam_B_index" ON "_AnnouncementToTeam"("B");

-- AddForeignKey
ALTER TABLE "_AnnouncementToTeam" ADD CONSTRAINT "_AnnouncementToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "annoucements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnnouncementToTeam" ADD CONSTRAINT "_AnnouncementToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

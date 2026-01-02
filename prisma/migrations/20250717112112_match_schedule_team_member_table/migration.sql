-- DropForeignKey
ALTER TABLE "match_schedule_team_member" DROP CONSTRAINT "match_schedule_team_member_first_team_member_id_fkey";

-- DropForeignKey
ALTER TABLE "match_schedule_team_member" DROP CONSTRAINT "match_schedule_team_member_second_team_member_id_fkey";

-- CreateTable
CREATE TABLE "_match_schedule_from_first_team_members" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_match_schedule_from_first_team_members_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_match_schedule_from_second_team_members" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_match_schedule_from_second_team_members_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_match_schedule_from_first_team_members_B_index" ON "_match_schedule_from_first_team_members"("B");

-- CreateIndex
CREATE INDEX "_match_schedule_from_second_team_members_B_index" ON "_match_schedule_from_second_team_members"("B");

-- AddForeignKey
ALTER TABLE "_match_schedule_from_first_team_members" ADD CONSTRAINT "_match_schedule_from_first_team_members_A_fkey" FOREIGN KEY ("A") REFERENCES "match_schedule_team_member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_match_schedule_from_first_team_members" ADD CONSTRAINT "_match_schedule_from_first_team_members_B_fkey" FOREIGN KEY ("B") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_match_schedule_from_second_team_members" ADD CONSTRAINT "_match_schedule_from_second_team_members_A_fkey" FOREIGN KEY ("A") REFERENCES "match_schedule_team_member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_match_schedule_from_second_team_members" ADD CONSTRAINT "_match_schedule_from_second_team_members_B_fkey" FOREIGN KEY ("B") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

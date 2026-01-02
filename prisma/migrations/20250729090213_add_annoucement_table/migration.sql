-- CreateTable
CREATE TABLE "annoucements" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "annoucements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnnoucementToTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AnnoucementToTeam_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "annoucements_subject_idx" ON "annoucements"("subject");

-- CreateIndex
CREATE INDEX "_AnnoucementToTeam_B_index" ON "_AnnoucementToTeam"("B");

-- AddForeignKey
ALTER TABLE "_AnnoucementToTeam" ADD CONSTRAINT "_AnnoucementToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "annoucements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnnoucementToTeam" ADD CONSTRAINT "_AnnoucementToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

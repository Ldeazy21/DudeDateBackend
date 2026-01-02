-- CreateTable
CREATE TABLE "match_attendance" (
    "id" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PENDING',
    "first_team_member_id" TEXT,
    "second_team_member_id" TEXT,
    "match_result_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_attendance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "match_attendance" ADD CONSTRAINT "match_attendance_match_result_id_fkey" FOREIGN KEY ("match_result_id") REFERENCES "match_result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_attendance" ADD CONSTRAINT "match_attendance_first_team_member_id_fkey" FOREIGN KEY ("first_team_member_id") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_attendance" ADD CONSTRAINT "match_attendance_second_team_member_id_fkey" FOREIGN KEY ("second_team_member_id") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

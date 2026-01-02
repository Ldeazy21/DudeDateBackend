-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TEAM_OWNER', 'USER');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'EXCUSED', 'PENDING');

-- CreateEnum
CREATE TYPE "TeamMemberRole" AS ENUM ('PLAYER', 'ASSISTANT_COACH', 'STATISTICAN', 'CAPTAIN');

-- CreateEnum
CREATE TYPE "Notification_Type" AS ENUM ('EVENT', 'MATCH_SCHEDULE', 'INVITATION');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_picture_url" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "stripe_customer_id" TEXT,
    "account_number" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "expire_at" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "img_url" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "address" TEXT,
    "user_d" TEXT NOT NULL,
    "event_fee" TEXT,
    "type" "EventType" NOT NULL DEFAULT 'PUBLIC',
    "ticket_purchase_url" TEXT,
    "bank_name" TEXT,
    "account_title" TEXT,
    "account_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "tema_member_role" "TeamMemberRole" NOT NULL DEFAULT 'PLAYER',
    "is_accepted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_schedule" (
    "id" TEXT NOT NULL,
    "first_team_name" TEXT NOT NULL,
    "second_team_name" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_data" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "address" TEXT,
    "match_fee" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "first_team_id" TEXT NOT NULL,
    "second_team_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_schedule_team_member" (
    "id" TEXT NOT NULL,
    "match_schedule_id" TEXT NOT NULL,
    "team_member_id" TEXT NOT NULL,
    "team_role" TEXT,
    "attendance_status" "AttendanceStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_schedule_team_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_result" (
    "id" TEXT NOT NULL,
    "final_first_team_score" INTEGER NOT NULL,
    "final_second_team_score" INTEGER NOT NULL,
    "highlights" TEXT NOT NULL,
    "match_schedule_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "top_performer" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "match_result_id" TEXT NOT NULL,
    "top_performer_first_team_member_id" TEXT NOT NULL,
    "top_performer_second_team_member_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "top_performer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "sender_id" TEXT,
    "user_id" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "type" "Notification_Type" NOT NULL,
    "event_id" TEXT,
    "match_schedule_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE INDEX "users_name_email_idx" ON "users"("name", "email");

-- CreateIndex
CREATE INDEX "event_title_idx" ON "event"("title");

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "teams"("name");

-- CreateIndex
CREATE INDEX "teams_name_idx" ON "teams"("name");

-- CreateIndex
CREATE UNIQUE INDEX "match_result_match_schedule_id_key" ON "match_result"("match_schedule_id");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_user_d_fkey" FOREIGN KEY ("user_d") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_schedule" ADD CONSTRAINT "match_schedule_first_team_id_fkey" FOREIGN KEY ("first_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_schedule" ADD CONSTRAINT "match_schedule_second_team_id_fkey" FOREIGN KEY ("second_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_schedule_team_member" ADD CONSTRAINT "match_schedule_team_member_match_schedule_id_fkey" FOREIGN KEY ("match_schedule_id") REFERENCES "match_schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_schedule_team_member" ADD CONSTRAINT "match_schedule_team_member_team_member_id_fkey" FOREIGN KEY ("team_member_id") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_result" ADD CONSTRAINT "match_result_match_schedule_id_fkey" FOREIGN KEY ("match_schedule_id") REFERENCES "match_schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "top_performer" ADD CONSTRAINT "top_performer_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "top_performer" ADD CONSTRAINT "top_performer_match_result_id_fkey" FOREIGN KEY ("match_result_id") REFERENCES "match_result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "top_performer" ADD CONSTRAINT "top_performer_top_performer_first_team_member_id_fkey" FOREIGN KEY ("top_performer_first_team_member_id") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "top_performer" ADD CONSTRAINT "top_performer_top_performer_second_team_member_id_fkey" FOREIGN KEY ("top_performer_second_team_member_id") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_match_schedule_id_fkey" FOREIGN KEY ("match_schedule_id") REFERENCES "match_schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

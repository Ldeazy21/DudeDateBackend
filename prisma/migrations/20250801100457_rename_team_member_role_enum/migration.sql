/*
  Warnings:

  - The values [STATISTICAN] on the enum `TeamMemberRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TeamMemberRole_new" AS ENUM ('PLAYER', 'ASSISTANT_COACH', 'STATISTICIAN', 'CAPTAIN');
ALTER TABLE "team_members" ALTER COLUMN "team_member_role" DROP DEFAULT;
ALTER TABLE "team_members" ALTER COLUMN "team_member_role" TYPE "TeamMemberRole_new" USING ("team_member_role"::text::"TeamMemberRole_new");
ALTER TYPE "TeamMemberRole" RENAME TO "TeamMemberRole_old";
ALTER TYPE "TeamMemberRole_new" RENAME TO "TeamMemberRole";
DROP TYPE "TeamMemberRole_old";
ALTER TABLE "team_members" ALTER COLUMN "team_member_role" SET DEFAULT 'PLAYER';
COMMIT;

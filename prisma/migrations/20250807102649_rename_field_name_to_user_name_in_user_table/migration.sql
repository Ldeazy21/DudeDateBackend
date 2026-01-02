/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_name_email_idx";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
ADD COLUMN     "user_name" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "users_user_name_email_idx" ON "users"("user_name", "email");

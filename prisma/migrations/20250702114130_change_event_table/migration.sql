/*
  Warnings:

  - You are about to drop the column `user_d` on the `event` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_user_d_fkey";

-- AlterTable
ALTER TABLE "event" DROP COLUMN "user_d",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

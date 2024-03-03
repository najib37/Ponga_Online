/*
  Warnings:

  - You are about to drop the column `recipientId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_senderId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "recipientId",
DROP COLUMN "senderId",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `recipientId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_ownerId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "ownerId",
ADD COLUMN     "recipientId" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

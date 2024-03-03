/*
  Warnings:

  - The primary key for the `Achievment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Achievment` table. All the data in the column will be lost.
  - You are about to drop the column `playerStatsId` on the `Game` table. All the data in the column will be lost.
  - The primary key for the `RoomUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `GameStats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersState` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_game Stats Relation` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,roomId]` on the table `RoomUsers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `loserId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GameStats" DROP CONSTRAINT "GameStats_playerId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_roomOwner_fkey";

-- DropForeignKey
ALTER TABLE "RoomUsers" DROP CONSTRAINT "RoomUsers_roomId_fkey";

-- DropForeignKey
ALTER TABLE "RoomUsers" DROP CONSTRAINT "RoomUsers_userId_fkey";

-- DropForeignKey
ALTER TABLE "RoomsMessages" DROP CONSTRAINT "RoomsMessages_roomId_fkey";

-- DropForeignKey
ALTER TABLE "RoomsMessages" DROP CONSTRAINT "RoomsMessages_senderId_fkey";

-- DropForeignKey
ALTER TABLE "UsersState" DROP CONSTRAINT "UsersState_userIdBlocked_fkey";

-- DropForeignKey
ALTER TABLE "UsersState" DROP CONSTRAINT "UsersState_userIdBlocker_fkey";

-- DropForeignKey
ALTER TABLE "_game Stats Relation" DROP CONSTRAINT "_game Stats Relation_A_fkey";

-- DropForeignKey
ALTER TABLE "_game Stats Relation" DROP CONSTRAINT "_game Stats Relation_B_fkey";

-- AlterTable
ALTER TABLE "Achievment" DROP CONSTRAINT "Achievment_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Achievment_pkey" PRIMARY KEY ("type");

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "playerStatsId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "loserId" TEXT NOT NULL,
ADD COLUMN     "loserScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "winnerId" TEXT NOT NULL,
ADD COLUMN     "winnerScore" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "readed" BOOLEAN DEFAULT false,
ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "roomOwner" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RoomUsers" DROP CONSTRAINT "RoomUsers_pkey",
ADD COLUMN     "muteDuration" TIMESTAMP(3),
ALTER COLUMN "state" SET DEFAULT 'NORMAL';

-- AlterTable
ALTER TABLE "RoomsMessages" ALTER COLUMN "createdAt" DROP DEFAULT;

-- DropTable
DROP TABLE "GameStats";

-- DropTable
DROP TABLE "UsersState";

-- DropTable
DROP TABLE "_game Stats Relation";

-- CreateTable
CREATE TABLE "_ingame achievments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_VMessage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ingame achievments_AB_unique" ON "_ingame achievments"("A", "B");

-- CreateIndex
CREATE INDEX "_ingame achievments_B_index" ON "_ingame achievments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_VMessage_AB_unique" ON "_VMessage"("A", "B");

-- CreateIndex
CREATE INDEX "_VMessage_B_index" ON "_VMessage"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Player_userId_key" ON "Player"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomUsers_userId_roomId_key" ON "RoomUsers"("userId", "roomId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Player"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "Player"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_roomOwner_fkey" FOREIGN KEY ("roomOwner") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUsers" ADD CONSTRAINT "RoomUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUsers" ADD CONSTRAINT "RoomUsers_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomsMessages" ADD CONSTRAINT "RoomsMessages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomsMessages" ADD CONSTRAINT "RoomsMessages_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ingame achievments" ADD CONSTRAINT "_ingame achievments_A_fkey" FOREIGN KEY ("A") REFERENCES "Achievment"("type") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ingame achievments" ADD CONSTRAINT "_ingame achievments_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VMessage" ADD CONSTRAINT "_VMessage_A_fkey" FOREIGN KEY ("A") REFERENCES "RoomsMessages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VMessage" ADD CONSTRAINT "_VMessage_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

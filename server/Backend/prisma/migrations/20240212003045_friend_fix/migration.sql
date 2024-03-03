/*
  Warnings:

  - You are about to drop the column `blockedId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `friendId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_blockedId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_friendId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "blockedId",
DROP COLUMN "friendId";

-- CreateTable
CREATE TABLE "_friendship" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_blocked" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_friendship_AB_unique" ON "_friendship"("A", "B");

-- CreateIndex
CREATE INDEX "_friendship_B_index" ON "_friendship"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_blocked_AB_unique" ON "_blocked"("A", "B");

-- CreateIndex
CREATE INDEX "_blocked_B_index" ON "_blocked"("B");

-- AddForeignKey
ALTER TABLE "_friendship" ADD CONSTRAINT "_friendship_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friendship" ADD CONSTRAINT "_friendship_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocked" ADD CONSTRAINT "_blocked_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocked" ADD CONSTRAINT "_blocked_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

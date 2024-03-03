/*
  Warnings:

  - You are about to drop the column `matchScore` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "matchScore";

-- CreateTable
CREATE TABLE "GameScore" (
    "gameId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "GameScore_pkey" PRIMARY KEY ("gameId")
);

-- CreateTable
CREATE TABLE "_GameScore" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GameScore_AB_unique" ON "_GameScore"("A", "B");

-- CreateIndex
CREATE INDEX "_GameScore_B_index" ON "_GameScore"("B");

-- AddForeignKey
ALTER TABLE "_GameScore" ADD CONSTRAINT "_GameScore_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameScore" ADD CONSTRAINT "_GameScore_B_fkey" FOREIGN KEY ("B") REFERENCES "GameScore"("gameId") ON DELETE CASCADE ON UPDATE CASCADE;

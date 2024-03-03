/*
  Warnings:

  - You are about to drop the column `player2StatsId` on the `Game` table. All the data in the column will be lost.
  - Added the required column `playerStatsId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "player2StatsId",
ADD COLUMN     "mode" "GameMods" NOT NULL DEFAULT 'CLASSIC',
ADD COLUMN     "playerStatsId" TEXT NOT NULL,
ADD COLUMN     "rounds" INTEGER NOT NULL DEFAULT 5;

-- CreateTable
CREATE TABLE "_game Stats Relation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_game Stats Relation_AB_unique" ON "_game Stats Relation"("A", "B");

-- CreateIndex
CREATE INDEX "_game Stats Relation_B_index" ON "_game Stats Relation"("B");

-- AddForeignKey
ALTER TABLE "_game Stats Relation" ADD CONSTRAINT "_game Stats Relation_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_game Stats Relation" ADD CONSTRAINT "_game Stats Relation_B_fkey" FOREIGN KEY ("B") REFERENCES "GameStats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

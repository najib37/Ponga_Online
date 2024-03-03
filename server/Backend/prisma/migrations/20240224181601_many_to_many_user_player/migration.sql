/*
  Warnings:

  - The primary key for the `Player` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `level` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `xp` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `GameScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GameScore` table. If the table is not empty, all the data it contains will be lost.
  - The required column `id` was added to the `Player` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "GameScore" DROP CONSTRAINT "GameScore_playerId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_userId_fkey";

-- DropForeignKey
ALTER TABLE "_Achievments" DROP CONSTRAINT "_Achievments_B_fkey";

-- DropForeignKey
ALTER TABLE "_Game" DROP CONSTRAINT "_Game_B_fkey";

-- DropForeignKey
ALTER TABLE "_GameScore" DROP CONSTRAINT "_GameScore_A_fkey";

-- DropForeignKey
ALTER TABLE "_GameScore" DROP CONSTRAINT "_GameScore_B_fkey";

-- AlterTable
ALTER TABLE "Player" DROP CONSTRAINT "Player_pkey",
DROP COLUMN "level",
DROP COLUMN "userId",
DROP COLUMN "xp",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "matchScore" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "gameResult" DROP NOT NULL,
ADD CONSTRAINT "Player_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "level" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "GameScore";

-- DropTable
DROP TABLE "_GameScore";

-- CreateTable
CREATE TABLE "_GamePlayer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GamePlayer_AB_unique" ON "_GamePlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_GamePlayer_B_index" ON "_GamePlayer"("B");

-- AddForeignKey
ALTER TABLE "_Game" ADD CONSTRAINT "_Game_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Achievments" ADD CONSTRAINT "_Achievments_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GamePlayer" ADD CONSTRAINT "_GamePlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GamePlayer" ADD CONSTRAINT "_GamePlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

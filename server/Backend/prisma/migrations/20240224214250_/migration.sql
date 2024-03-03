/*
  Warnings:

  - You are about to drop the column `mode` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `rounds` on the `Game` table. All the data in the column will be lost.
  - The primary key for the `Player` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `gameResult` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `matchScore` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `xp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_Achievments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GamePlayer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `player2StatsId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xp` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_Achievments" DROP CONSTRAINT "_Achievments_A_fkey";

-- DropForeignKey
ALTER TABLE "_Achievments" DROP CONSTRAINT "_Achievments_B_fkey";

-- DropForeignKey
ALTER TABLE "_Game" DROP CONSTRAINT "_Game_A_fkey";

-- DropForeignKey
ALTER TABLE "_Game" DROP CONSTRAINT "_Game_B_fkey";

-- DropForeignKey
ALTER TABLE "_GamePlayer" DROP CONSTRAINT "_GamePlayer_A_fkey";

-- DropForeignKey
ALTER TABLE "_GamePlayer" DROP CONSTRAINT "_GamePlayer_B_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "mode",
DROP COLUMN "rounds",
ADD COLUMN     "player2StatsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Player" DROP CONSTRAINT "Player_pkey",
DROP COLUMN "gameResult",
DROP COLUMN "id",
DROP COLUMN "matchScore",
ADD COLUMN     "level" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "xp" INTEGER NOT NULL,
ADD CONSTRAINT "Player_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "level",
DROP COLUMN "xp";

-- DropTable
DROP TABLE "_Achievments";

-- DropTable
DROP TABLE "_Game";

-- DropTable
DROP TABLE "_GamePlayer";

-- CreateTable
CREATE TABLE "GameStats" (
    "id" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "GameStats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStats" ADD CONSTRAINT "GameStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

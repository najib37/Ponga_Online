/*
  Warnings:

  - The primary key for the `GameScore` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_GameScore" DROP CONSTRAINT "_GameScore_B_fkey";

-- AlterTable
ALTER TABLE "GameScore" DROP CONSTRAINT "GameScore_pkey",
ADD CONSTRAINT "GameScore_pkey" PRIMARY KEY ("playerId");

-- AddForeignKey
ALTER TABLE "GameScore" ADD CONSTRAINT "GameScore_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameScore" ADD CONSTRAINT "_GameScore_B_fkey" FOREIGN KEY ("B") REFERENCES "GameScore"("playerId") ON DELETE CASCADE ON UPDATE CASCADE;

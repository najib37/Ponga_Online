/*
  Warnings:

  - You are about to drop the column `MatchScore` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "MatchScore",
ADD COLUMN     "matchScore" INTEGER NOT NULL DEFAULT 0;

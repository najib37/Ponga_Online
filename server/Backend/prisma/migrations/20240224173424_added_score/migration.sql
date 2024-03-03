/*
  Warnings:

  - Added the required column `score` to the `GameScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameScore" ADD COLUMN     "score" TEXT NOT NULL;

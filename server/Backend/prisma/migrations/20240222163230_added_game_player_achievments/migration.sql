-- CreateEnum
CREATE TYPE "gameResults" AS ENUM ('WIN', 'LOSE', 'RESIGN');

-- CreateEnum
CREATE TYPE "GameMods" AS ENUM ('YINYANG', 'CLASHOFCOLORS', 'CLASSIC');

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_recipientId_fkey";

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "rounds" INTEGER NOT NULL DEFAULT 5,
    "mode" "GameMods" NOT NULL DEFAULT 'CLASSIC',

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievment" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Achievment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "gameResult" "gameResults" NOT NULL,
    "level" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "MatchScore" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "_Game" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Achievments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Achievment_type_key" ON "Achievment"("type");

-- CreateIndex
CREATE UNIQUE INDEX "_Game_AB_unique" ON "_Game"("A", "B");

-- CreateIndex
CREATE INDEX "_Game_B_index" ON "_Game"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Achievments_AB_unique" ON "_Achievments"("A", "B");

-- CreateIndex
CREATE INDEX "_Achievments_B_index" ON "_Achievments"("B");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Game" ADD CONSTRAINT "_Game_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Game" ADD CONSTRAINT "_Game_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Achievments" ADD CONSTRAINT "_Achievments_A_fkey" FOREIGN KEY ("A") REFERENCES "Achievment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Achievments" ADD CONSTRAINT "_Achievments_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

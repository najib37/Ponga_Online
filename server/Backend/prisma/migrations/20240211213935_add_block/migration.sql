-- AlterTable
ALTER TABLE "User" ADD COLUMN     "blockedId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

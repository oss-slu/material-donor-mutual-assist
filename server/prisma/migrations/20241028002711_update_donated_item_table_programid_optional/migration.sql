-- DropForeignKey
ALTER TABLE "DonatedItem" DROP CONSTRAINT "DonatedItem_programId_fkey";

-- AlterTable
ALTER TABLE "DonatedItem" ALTER COLUMN "programId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DonatedItem" ADD CONSTRAINT "DonatedItem_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

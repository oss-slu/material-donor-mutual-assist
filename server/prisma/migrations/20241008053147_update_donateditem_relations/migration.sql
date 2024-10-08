/*
  Warnings:

  - You are about to drop the column `donorEmail` on the `DonatedItem` table. All the data in the column will be lost.
  - You are about to drop the column `program` on the `DonatedItem` table. All the data in the column will be lost.
  - Added the required column `donorId` to the `DonatedItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programId` to the `DonatedItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DonatedItem" DROP COLUMN "donorEmail",
DROP COLUMN "program",
ADD COLUMN     "donorId" INTEGER NOT NULL,
ADD COLUMN     "programId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "DonatedItem" ADD CONSTRAINT "DonatedItem_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonatedItem" ADD CONSTRAINT "DonatedItem_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

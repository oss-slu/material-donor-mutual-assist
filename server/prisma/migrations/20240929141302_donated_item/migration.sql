/*
  Warnings:

  - You are about to alter the column `itemType` on the `DonatedItem` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `currentStatus` on the `DonatedItem` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `donorEmail` on the `DonatedItem` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `program` on the `DonatedItem` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `statusType` on the `DonatedItemStatus` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "DonatedItem" ALTER COLUMN "itemType" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "currentStatus" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "donorEmail" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "program" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "DonatedItemStatus" ALTER COLUMN "statusType" SET DATA TYPE VARCHAR(20);

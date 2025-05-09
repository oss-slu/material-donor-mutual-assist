-- DropForeignKey
ALTER TABLE "DonatedItemStatus" DROP CONSTRAINT "DonatedItemStatus_donatedItemId_fkey";

-- AddForeignKey
ALTER TABLE "DonatedItemStatus" ADD CONSTRAINT "DonatedItemStatus_donatedItemId_fkey" FOREIGN KEY ("donatedItemId") REFERENCES "DonatedItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

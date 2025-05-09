-- CreateTable
CREATE TABLE "DonatedItem" (
    "id" SERIAL NOT NULL,
    "itemType" TEXT NOT NULL,
    "currentStatus" TEXT NOT NULL,
    "donorEmail" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "dateDonated" TIMESTAMP(3) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DonatedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonatedItemStatus" (
    "id" SERIAL NOT NULL,
    "dateModified" TIMESTAMP(3) NOT NULL,
    "statusType" TEXT NOT NULL,
    "donatedItemId" INTEGER NOT NULL,

    CONSTRAINT "DonatedItemStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DonatedItemStatus_donatedItemId_idx" ON "DonatedItemStatus"("donatedItemId");

-- AddForeignKey
ALTER TABLE "DonatedItemStatus" ADD CONSTRAINT "DonatedItemStatus_donatedItemId_fkey" FOREIGN KEY ("donatedItemId") REFERENCES "DonatedItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

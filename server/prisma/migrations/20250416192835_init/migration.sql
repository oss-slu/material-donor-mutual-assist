-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DONOR');

-- CreateTable
CREATE TABLE "Donor" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "contact" VARCHAR(10),
    "email" VARCHAR(100) NOT NULL,
    "addressLine1" VARCHAR(50),
    "addressLine2" VARCHAR(50),
    "state" VARCHAR(15),
    "city" VARCHAR(15),
    "zipcode" VARCHAR(20) NOT NULL,
    "emailOptIn" BOOLEAN NOT NULL,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonatedItem" (
    "id" SERIAL NOT NULL,
    "itemType" VARCHAR(50) NOT NULL,
    "currentStatus" VARCHAR(20) NOT NULL,
    "dateDonated" TIMESTAMP(3) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "donorId" INTEGER NOT NULL,
    "programId" INTEGER,

    CONSTRAINT "DonatedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonatedItemStatus" (
    "id" SERIAL NOT NULL,
    "dateModified" TIMESTAMP(3) NOT NULL,
    "statusType" VARCHAR(20) NOT NULL,
    "donatedItemId" INTEGER NOT NULL,
    "imageUrls" TEXT[],

    CONSTRAINT "DonatedItemStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "startDate" DATE NOT NULL,
    "aimAndCause" VARCHAR(500) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstLogin" BOOLEAN NOT NULL DEFAULT true,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Donor_email_key" ON "Donor"("email");

-- CreateIndex
CREATE INDEX "DonatedItemStatus_donatedItemId_idx" ON "DonatedItemStatus"("donatedItemId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "DonatedItem" ADD CONSTRAINT "DonatedItem_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonatedItem" ADD CONSTRAINT "DonatedItem_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonatedItemStatus" ADD CONSTRAINT "DonatedItemStatus_donatedItemId_fkey" FOREIGN KEY ("donatedItemId") REFERENCES "DonatedItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

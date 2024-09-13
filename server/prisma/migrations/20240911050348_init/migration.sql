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

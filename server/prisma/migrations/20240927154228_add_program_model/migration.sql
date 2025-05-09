-- CreateTable
CREATE TABLE "Program" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "startDate" DATE NOT NULL,
    "aimAndCause" VARCHAR(500) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

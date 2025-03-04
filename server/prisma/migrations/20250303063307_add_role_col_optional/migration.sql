-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DONOR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role";

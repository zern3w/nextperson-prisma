/*
  Warnings:

  - Made the column `dob` on table `Person` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "dob" SET NOT NULL,
ALTER COLUMN "dob" SET DEFAULT NOW();

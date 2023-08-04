/*
  Warnings:

  - You are about to alter the column `createdAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `updatedAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DATA TYPE INTEGER,
ALTER COLUMN "updatedAt" SET DATA TYPE INTEGER;

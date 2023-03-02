/*
  Warnings:

  - Made the column `token_expiration` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `token_expiration` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

/*
  Warnings:

  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_ibfk_3`;

-- AlterTable
ALTER TABLE `Answer` MODIFY `option_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `email` VARCHAR(256) NOT NULL;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_ibfk_3` FOREIGN KEY (`option_id`) REFERENCES `Option`(`option_id`) ON DELETE SET NULL ON UPDATE RESTRICT;

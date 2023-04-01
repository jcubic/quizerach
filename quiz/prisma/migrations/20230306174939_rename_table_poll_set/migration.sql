/*
  Warnings:

  - You are about to drop the `Poll_Set` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Poll` DROP FOREIGN KEY `Poll_set_id_fkey`;

-- DropTable
DROP TABLE `Poll_Set`;

-- CreateTable
CREATE TABLE `Set` (
    `set_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`set_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Poll` ADD CONSTRAINT `Poll_set_id_fkey` FOREIGN KEY (`set_id`) REFERENCES `Set`(`set_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

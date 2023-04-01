/*
  Warnings:

  - Added the required column `set_id` to the `Poll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Poll` ADD COLUMN `set_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Poll_Set` (
    `poll_set_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`poll_set_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Poll` ADD CONSTRAINT `Poll_set_id_fkey` FOREIGN KEY (`set_id`) REFERENCES `Poll_Set`(`poll_set_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `User_Pool` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `User_Pool` DROP FOREIGN KEY `user_pool_ibfk_1`;

-- DropTable
DROP TABLE `User_Pool`;

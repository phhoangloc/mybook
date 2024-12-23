/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Blog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Book` DROP FOREIGN KEY `Book_fileId_fkey`;

-- AlterTable
ALTER TABLE `Blog` DROP COLUMN `categoryId`;

-- AlterTable
ALTER TABLE `Book` MODIFY `archive` VARCHAR(191) NOT NULL DEFAULT 'book',
    MODIFY `fileId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

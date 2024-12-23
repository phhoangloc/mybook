/*
  Warnings:

  - Made the column `coverId` on table `Blog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `coverId` on table `Book` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Blog` DROP FOREIGN KEY `Blog_coverId_fkey`;

-- DropForeignKey
ALTER TABLE `Book` DROP FOREIGN KEY `Book_coverId_fkey`;

-- AlterTable
ALTER TABLE `Blog` MODIFY `coverId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Book` MODIFY `coverId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Blog` ADD CONSTRAINT `Blog_coverId_fkey` FOREIGN KEY (`coverId`) REFERENCES `Pic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_coverId_fkey` FOREIGN KEY (`coverId`) REFERENCES `Pic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to alter the column `status` on the `OnLoanBook` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `OnLoanBook` MODIFY `status` ENUM('onRequest', 'onLoan') NOT NULL DEFAULT 'onRequest';

-- AlterTable
ALTER TABLE `OnLoanBook` ADD COLUMN `status` ENUM('notyet', 'onLoan') NOT NULL DEFAULT 'notyet';

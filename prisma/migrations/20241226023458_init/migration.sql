-- AlterTable
ALTER TABLE `OnLoanBook` MODIFY `status` ENUM('onRequest', 'onSend', 'onLoan', 'onReturn', 'onFinish') NOT NULL DEFAULT 'onRequest';

-- Add isRead column to contact_messages if it doesn't exist
ALTER TABLE `contact_messages`
  ADD COLUMN IF NOT EXISTS `isRead` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable contact_replies
CREATE TABLE IF NOT EXISTS `contact_replies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `messageId` INTEGER NOT NULL,
    `senderType` VARCHAR(20) NOT NULL,
    `senderName` VARCHAR(150) NOT NULL,
    `senderEmail` VARCHAR(150) NOT NULL,
    `content` TEXT NOT NULL,
    `sentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    CONSTRAINT `contact_replies_messageId_fkey`
        FOREIGN KEY (`messageId`) REFERENCES `contact_messages`(`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

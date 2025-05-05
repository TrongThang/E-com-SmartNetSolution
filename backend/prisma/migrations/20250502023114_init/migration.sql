/*
  Warnings:

  - The primary key for the `account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `employee` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `account_ibfk_2`;

-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `account_ibfk_3`;

-- DropForeignKey
ALTER TABLE `address_book` DROP FOREIGN KEY `address_book_ibfk_1`;

-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `cart_ibfk_1`;

-- DropForeignKey
ALTER TABLE `device_templates` DROP FOREIGN KEY `device_templates_ibfk_2`;

-- DropForeignKey
ALTER TABLE `devices` DROP FOREIGN KEY `devices_ibfk_3`;

-- DropForeignKey
ALTER TABLE `export_warehouse` DROP FOREIGN KEY `export_warehouse_ibfk_1`;

-- DropForeignKey
ALTER TABLE `import_warehouse` DROP FOREIGN KEY `import_warehouse_ibfk_1`;

-- DropForeignKey
ALTER TABLE `liked` DROP FOREIGN KEY `liked_ibfk_1`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `notification_ibfk_1`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_ibfk_1`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_ibfk_2`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_ibfk_3`;

-- DropForeignKey
ALTER TABLE `ownership_history` DROP FOREIGN KEY `ownership_history_ibfk_3`;

-- DropForeignKey
ALTER TABLE `ownership_history` DROP FOREIGN KEY `ownership_history_ibfk_4`;

-- DropForeignKey
ALTER TABLE `payment_info` DROP FOREIGN KEY `payment_info_ibfk_1`;

-- DropForeignKey
ALTER TABLE `production_batches` DROP FOREIGN KEY `production_batches_ibfk_2`;

-- DropForeignKey
ALTER TABLE `production_batches` DROP FOREIGN KEY `production_batches_ibfk_3`;

-- DropForeignKey
ALTER TABLE `production_tracking` DROP FOREIGN KEY `production_tracking_ibfk_3`;

-- DropForeignKey
ALTER TABLE `review_product` DROP FOREIGN KEY `review_product_ibfk_1`;

-- DropForeignKey
ALTER TABLE `share_requests` DROP FOREIGN KEY `share_requests_ibfk_2`;

-- DropForeignKey
ALTER TABLE `share_requests` DROP FOREIGN KEY `share_requests_ibfk_3`;

-- DropForeignKey
ALTER TABLE `shared_permissions` DROP FOREIGN KEY `shared_permissions_ibfk_2`;

-- DropForeignKey
ALTER TABLE `sync_tracking` DROP FOREIGN KEY `sync_tracking_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `tickets_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `tickets_ibfk_4`;

-- DropForeignKey
ALTER TABLE `user_devices` DROP FOREIGN KEY `user_devices_ibfk_1`;

-- DropForeignKey
ALTER TABLE `user_groups` DROP FOREIGN KEY `user_groups_ibfk_1`;

-- AlterTable
ALTER TABLE `account` DROP PRIMARY KEY,
    MODIFY `account_id` VARCHAR(32) NOT NULL,
    MODIFY `customer_id` VARCHAR(32) NULL,
    MODIFY `employee_id` VARCHAR(32) NULL,
    ADD PRIMARY KEY (`account_id`);

-- AlterTable
ALTER TABLE `address_book` MODIFY `customer_id` VARCHAR(32) NULL;

-- AlterTable
ALTER TABLE `alert_types` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `alerts` MODIFY `timestamp` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `blog` MODIFY `author` VARCHAR(32) NULL;

-- AlterTable
ALTER TABLE `cart` MODIFY `customer_id` VARCHAR(32) NOT NULL;

-- AlterTable
ALTER TABLE `components` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `customer` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(32) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `device_templates` MODIFY `created_by` VARCHAR(32) NULL,
    MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `devices` MODIFY `account_id` VARCHAR(32) NULL,
    MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `employee` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(32) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `export_warehouse` MODIFY `employee_id` VARCHAR(32) NULL;

-- AlterTable
ALTER TABLE `firmware` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `firmware_update_history` MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `created_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `groups` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `hourly_values` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `houses` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `import_warehouse` MODIFY `employee_id` VARCHAR(32) NULL;

-- AlterTable
ALTER TABLE `liked` MODIFY `customer_id` VARCHAR(32) NOT NULL;

-- AlterTable
ALTER TABLE `notification` MODIFY `account_id` VARCHAR(32) NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `customer_id` VARCHAR(32) NULL,
    MODIFY `saler_id` VARCHAR(32) NULL,
    MODIFY `shipper_id` VARCHAR(32) NULL;

-- AlterTable
ALTER TABLE `ownership_history` MODIFY `from_user_id` VARCHAR(32) NULL,
    MODIFY `to_user_id` VARCHAR(32) NULL,
    MODIFY `transferred_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `payment_info` MODIFY `customer_id` VARCHAR(32) NULL;

-- AlterTable
ALTER TABLE `production_batches` MODIFY `created_by` VARCHAR(32) NULL,
    MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `approved_by` VARCHAR(32) NULL,
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `production_components` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `production_tracking` MODIFY `employee_id` VARCHAR(32) NULL,
    MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `review_product` MODIFY `customer_id` VARCHAR(32) NULL;

-- AlterTable
ALTER TABLE `share_requests` MODIFY `from_user_id` VARCHAR(32) NULL,
    MODIFY `to_user_id` VARCHAR(32) NULL,
    MODIFY `requested_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `shared_permissions` MODIFY `shared_with_user_id` VARCHAR(32) NULL,
    MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `spaces` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `sync_tracking` MODIFY `account_id` VARCHAR(32) NULL,
    MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `template_components` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `ticket_types` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `tickets` MODIFY `user_id` VARCHAR(32) NULL,
    MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `assigned_to` VARCHAR(32) NULL;

-- AlterTable
ALTER TABLE `user_devices` MODIFY `user_id` VARCHAR(32) NULL,
    MODIFY `last_login` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `user_groups` MODIFY `account_id` VARCHAR(32) NULL,
    MODIFY `joined_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `address_book` ADD CONSTRAINT `address_book_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `device_templates` ADD CONSTRAINT `device_templates_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `devices` ADD CONSTRAINT `devices_ibfk_3` FOREIGN KEY (`account_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `export_warehouse` ADD CONSTRAINT `export_warehouse_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `import_warehouse` ADD CONSTRAINT `import_warehouse_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `liked` ADD CONSTRAINT `liked_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`saler_id`) REFERENCES `employee`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_ibfk_3` FOREIGN KEY (`shipper_id`) REFERENCES `employee`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ownership_history` ADD CONSTRAINT `ownership_history_ibfk_3` FOREIGN KEY (`from_user_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ownership_history` ADD CONSTRAINT `ownership_history_ibfk_4` FOREIGN KEY (`to_user_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `payment_info` ADD CONSTRAINT `payment_info_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `production_batches` ADD CONSTRAINT `production_batches_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `production_batches` ADD CONSTRAINT `production_batches_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `production_tracking` ADD CONSTRAINT `production_tracking_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `review_product` ADD CONSTRAINT `review_product_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `share_requests` ADD CONSTRAINT `share_requests_ibfk_2` FOREIGN KEY (`from_user_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `share_requests` ADD CONSTRAINT `share_requests_ibfk_3` FOREIGN KEY (`to_user_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `shared_permissions` ADD CONSTRAINT `shared_permissions_ibfk_2` FOREIGN KEY (`shared_with_user_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sync_tracking` ADD CONSTRAINT `sync_tracking_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_ibfk_4` FOREIGN KEY (`assigned_to`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_devices` ADD CONSTRAINT `user_devices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_groups` ADD CONSTRAINT `user_groups_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

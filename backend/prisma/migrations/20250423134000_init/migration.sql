-- CreateTable
CREATE TABLE `account` (
    `account_id` VARCHAR(12) NOT NULL,
    `customer_id` VARCHAR(12) NULL,
    `employee_id` VARCHAR(12) NULL,
    `role_id` VARCHAR(5) NULL,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(50) NULL,
    `verification_code` VARCHAR(6) NULL,
    `verification_expiry` DATETIME(0) NULL,
    `report` TINYINT NULL,
    `is_new` BOOLEAN NULL,
    `status` TINYINT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `is_locked` BOOLEAN NULL DEFAULT false,
    `locked_at` DATETIME(0) NULL,

    INDEX `customer_id`(`customer_id`),
    INDEX `employee_id`(`employee_id`),
    INDEX `role_id`(`role_id`),
    PRIMARY KEY (`account_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `address_book` (
    `id` INTEGER NOT NULL,
    `customer_id` VARCHAR(12) NULL,
    `district` VARCHAR(500) NULL,
    `city` VARCHAR(500) NULL,
    `ward` VARCHAR(500) NULL,
    `street` VARCHAR(500) NULL,
    `detail` VARCHAR(500) NULL,
    `is_default` BOOLEAN NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `customer_id`(`customer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alert_types` (
    `alert_type_id` INTEGER NOT NULL AUTO_INCREMENT,
    `alert_type_name` VARCHAR(500) NOT NULL,
    `priority` INTEGER NULL DEFAULT 1,
    `is_deleted` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),

    PRIMARY KEY (`alert_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alerts` (
    `alert_id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_serial` VARCHAR(50) NULL,
    `space_id` INTEGER NULL,
    `message` TEXT NULL,
    `timestamp` DATETIME(0) NULL DEFAULT (now()),
    `status` VARCHAR(20) NULL DEFAULT 'unread',
    `alert_type_id` INTEGER NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    INDEX `alert_type_id`(`alert_type_id`),
    INDEX `device_serial`(`device_serial`),
    INDEX `space_id`(`space_id`),
    PRIMARY KEY (`alert_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attribute` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(500) NULL,
    `datatype` VARCHAR(500) NULL,
    `required` BOOLEAN NULL,
    `group_attribute_id` INTEGER NULL,
    `is_hide` BOOLEAN NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `group_attribute_id`(`group_attribute_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attribute_category` (
    `id` INTEGER NOT NULL,
    `attribute_id` INTEGER NULL,
    `category_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `attribute_id`(`attribute_id`),
    INDEX `category_id`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attribute_group` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(500) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attribute_product` (
    `product_id` INTEGER NOT NULL,
    `attribute_id` INTEGER NULL,
    `is_hide` BOOLEAN NULL,
    `value` VARCHAR(500) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `attribute_id`(`attribute_id`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `batch_product_detail` (
    `id` INTEGER NOT NULL,
    `exp_batch_id` VARCHAR(50) NULL,
    `imp_batch_id` VARCHAR(50) NOT NULL,
    `seral_number` VARCHAR(20) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `exp_batch_id`(`exp_batch_id`),
    INDEX `imp_batch_id`(`imp_batch_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog` (
    `id` INTEGER NOT NULL,
    `category_id` INTEGER NULL,
    `product_id` INTEGER NULL,
    `title` VARCHAR(500) NULL,
    `author` VARCHAR(12) NULL,
    `content` VARCHAR(500) NULL,
    `content_normal` TEXT NULL,
    `image` MEDIUMTEXT NULL,
    `score` INTEGER NULL,
    `is_hide` BOOLEAN NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `category_id`(`category_id`),
    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart` (
    `id` INTEGER NOT NULL,
    `customer_id` VARCHAR(12) NOT NULL,
    `product_id` INTEGER NULL,
    `quantity` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `customer_id`(`customer_id`),
    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `category_id` INTEGER NOT NULL,
    `key` VARCHAR(50) NULL,
    `name` VARCHAR(500) NULL,
    `slug` VARCHAR(500) NULL,
    `parent_id` INTEGER NULL,
    `image` MEDIUMTEXT NULL,
    `description` TEXT NULL,
    `is_hide` BIT(1) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `parent_id`(`parent_id`),
    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `components` (
    `component_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `supplier` VARCHAR(100) NULL,
    `quantity_in_stock` INTEGER NULL DEFAULT 0,
    `unit_cost` DECIMAL(10, 2) NULL,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`component_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact` (
    `id` INTEGER NOT NULL,
    `fullname` VARCHAR(500) NULL,
    `title` VARCHAR(500) NULL,
    `content` TEXT NULL,
    `email` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer` (
    `id` VARCHAR(12) NOT NULL,
    `surname` VARCHAR(500) NULL,
    `lastname` VARCHAR(500) NULL,
    `image` MEDIUMTEXT NULL,
    `phone` VARCHAR(12) NULL,
    `email` VARCHAR(100) NULL,
    `email_verified` BOOLEAN NULL DEFAULT false,
    `birthdate` DATE NULL,
    `gender` BOOLEAN NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_export` (
    `batch_code` VARCHAR(50) NOT NULL,
    `export_id` INTEGER NOT NULL,
    `order_id` INTEGER NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NULL,
    `note` VARCHAR(500) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `export_id`(`export_id`),
    INDEX `order_id`(`order_id`),
    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`batch_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_import` (
    `batch_code` VARCHAR(50) NOT NULL,
    `import_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NULL,
    `import_price` DOUBLE NULL,
    `sale_price` DOUBLE NULL,
    `discount` INTEGER NULL,
    `amount` INTEGER NULL,
    `is_gift` BOOLEAN NULL,
    `note` VARCHAR(500) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `import_id`(`import_id`),
    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`batch_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `device_templates` (
    `template_id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_type_id` INTEGER NULL,
    `name` VARCHAR(100) NOT NULL,
    `created_by` VARCHAR(12) NULL,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    INDEX `created_by`(`created_by`),
    INDEX `device_type_id`(`device_type_id`),
    PRIMARY KEY (`template_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `devices` (
    `device_id` INTEGER NOT NULL AUTO_INCREMENT,
    `serial_number` VARCHAR(50) NOT NULL,
    `template_id` INTEGER NULL,
    `space_id` INTEGER NULL,
    `account_id` VARCHAR(12) NULL,
    `group_id` INTEGER NULL,
    `hub_id` VARCHAR(50) NULL,
    `firmware_id` INTEGER NULL,
    `name` VARCHAR(100) NOT NULL,
    `power_status` BOOLEAN NULL DEFAULT false,
    `attribute` JSON NULL,
    `wifi_ssid` VARCHAR(50) NULL,
    `wifi_password` VARCHAR(50) NULL,
    `current_value` JSON NULL,
    `link_status` VARCHAR(20) NULL DEFAULT 'unlinked',
    `last_reset_at` DATETIME(0) NULL,
    `lock_status` VARCHAR(20) NULL DEFAULT 'unlocked',
    `locked_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `serial_number`(`serial_number`),
    INDEX `account_id`(`account_id`),
    INDEX `firmware_id`(`firmware_id`),
    INDEX `group_id`(`group_id`),
    INDEX `hub_id`(`hub_id`),
    INDEX `space_id`(`space_id`),
    INDEX `template_id`(`template_id`),
    PRIMARY KEY (`device_id`, `serial_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee` (
    `id` VARCHAR(12) NOT NULL,
    `surname` VARCHAR(500) NULL,
    `lastname` VARCHAR(500) NULL,
    `image` MEDIUMTEXT NULL,
    `email` VARCHAR(500) NULL,
    `birthdate` DATE NULL,
    `gender` BOOLEAN NULL,
    `phone` VARCHAR(12) NULL,
    `status` TINYINT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `export_warehouse` (
    `id` INTEGER NOT NULL,
    `export_code` VARCHAR(12) NULL,
    `export_number` INTEGER NULL,
    `employee_id` VARCHAR(12) NULL,
    `export_date` DATE NULL,
    `file_authenticate` MEDIUMTEXT NULL,
    `total_profit` DOUBLE NULL,
    `note` VARCHAR(500) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `employee_id`(`employee_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `firmware` (
    `firmware_id` INTEGER NOT NULL AUTO_INCREMENT,
    `version` VARCHAR(50) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `template_id` INTEGER NULL,
    `is_mandatory` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `tested_at` DATETIME(0) NULL,
    `is_approved` BOOLEAN NULL DEFAULT false,
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,
    `note` TEXT NULL,

    INDEX `template_id`(`template_id`),
    PRIMARY KEY (`firmware_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `firmware_update_history` (
    `update_id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_serial` VARCHAR(50) NULL,
    `firmware_id` INTEGER NULL,
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `status` VARCHAR(20) NULL DEFAULT 'success',
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    INDEX `device_serial`(`device_serial`),
    INDEX `firmware_id`(`firmware_id`),
    PRIMARY KEY (`update_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `groups` (
    `group_id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`group_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hourly_values` (
    `hourly_value_id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_serial` VARCHAR(50) NULL,
    `space_id` INTEGER NULL,
    `hour_timestamp` DATETIME(0) NULL,
    `avg_value` JSON NULL,
    `sample_count` INTEGER NULL,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    INDEX `device_serial`(`device_serial`),
    INDEX `space_id`(`space_id`),
    PRIMARY KEY (`hourly_value_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `houses` (
    `house_id` INTEGER NOT NULL AUTO_INCREMENT,
    `group_id` INTEGER NULL,
    `name` VARCHAR(100) NOT NULL,
    `address` TEXT NULL,
    `icon_name` VARCHAR(100) NULL,
    `icon_color` VARCHAR(100) NULL,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    INDEX `group_id`(`group_id`),
    PRIMARY KEY (`house_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image_product` (
    `id` INTEGER NOT NULL,
    `product_id` INTEGER NULL,
    `image` MEDIUMTEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `import_warehouse` (
    `id` INTEGER NOT NULL,
    `import_number` INTEGER NULL,
    `import_id` VARCHAR(12) NULL,
    `employee_id` VARCHAR(12) NULL,
    `warehouse_id` INTEGER NULL,
    `import_date` DATE NULL,
    `file_authenticate` MEDIUMTEXT NULL,
    `total_money` DOUBLE NULL,
    `prepaid` DOUBLE NULL,
    `remaining` DOUBLE NULL,
    `note` VARCHAR(500) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `employee_id`(`employee_id`),
    INDEX `warehouse_id`(`warehouse_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `info_website` (
    `id` INTEGER NOT NULL,
    `KEY_NAME` VARCHAR(500) NULL,
    `VALUE` VARCHAR(500) NULL,
    `ID_PAGE` TINYINT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `liked` (
    `id` INTEGER NOT NULL,
    `customer_id` VARCHAR(12) NOT NULL,
    `product_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `customer_id`(`customer_id`),
    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` INTEGER NOT NULL,
    `account_id` VARCHAR(12) NULL,
    `role_id` VARCHAR(5) NULL,
    `text` VARCHAR(255) NULL,
    `type` VARCHAR(200) NULL,
    `is_read` BOOLEAN NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `account_id`(`account_id`),
    INDEX `role_id`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order` (
    `id` INTEGER NOT NULL,
    `order_number` INTEGER NULL,
    `order_id` VARCHAR(12) NULL,
    `customer_id` VARCHAR(12) NULL,
    `saler_id` VARCHAR(12) NULL,
    `shipper_id` VARCHAR(12) NULL,
    `export_date` DATE NULL,
    `total_import_money` DOUBLE NULL,
    `total_money` DOUBLE NULL,
    `discount` DOUBLE NULL,
    `vat` FLOAT NULL,
    `amount` DOUBLE NULL,
    `prepaid` DOUBLE NULL,
    `remaining` DOUBLE NULL,
    `profit` DOUBLE NULL,
    `address` VARCHAR(500) NULL,
    `payment_method` VARCHAR(50) NULL,
    `payment_account` VARCHAR(30) NULL,
    `phone` VARCHAR(12) NULL,
    `name_recipient` VARCHAR(150) NULL,
    `note` VARCHAR(500) NULL,
    `platform_order` VARCHAR(50) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `customer_id`(`customer_id`),
    INDEX `saler_id`(`saler_id`),
    INDEX `shipper_id`(`shipper_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_detail` (
    `id` INTEGER NOT NULL,
    `order_id` INTEGER NULL,
    `product_id` INTEGER NULL,
    `batch_code` VARCHAR(50) NULL,
    `unit` VARCHAR(30) NULL,
    `import_price` DOUBLE NULL,
    `sale_price` DOUBLE NULL,
    `discount` DOUBLE NULL,
    `quantity_sold` DOUBLE NULL,
    `amount` DOUBLE NULL,
    `delivery_date` DATETIME(0) NULL,
    `receiving_date` DATETIME(0) NULL,
    `is_gift` BOOLEAN NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `order_id`(`order_id`),
    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ownership_history` (
    `history_id` INTEGER NOT NULL AUTO_INCREMENT,
    `approved_request_id` INTEGER NOT NULL,
    `device_serial` VARCHAR(50) NULL,
    `from_user_id` VARCHAR(12) NULL,
    `to_user_id` VARCHAR(12) NULL,
    `transferred_at` DATETIME(0) NULL DEFAULT (now()),
    `legal_expired_date` DATETIME(0) NULL,
    `is_expired` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    INDEX `approved_request_id`(`approved_request_id`),
    INDEX `device_serial`(`device_serial`),
    INDEX `from_user_id`(`from_user_id`),
    INDEX `to_user_id`(`to_user_id`),
    PRIMARY KEY (`history_id`, `approved_request_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_info` (
    `id` INTEGER NOT NULL,
    `customer_id` VARCHAR(12) NULL,
    `account_number` VARCHAR(30) NULL,
    `bank` VARCHAR(50) NULL,
    `name_account` VARCHAR(150) NULL,
    `is_default` BOOLEAN NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `customer_id`(`customer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permission` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(500) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permission_role` (
    `id` INTEGER NOT NULL,
    `role_id` VARCHAR(5) NOT NULL,
    `permission_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `permission_id`(`permission_id`),
    INDEX `role_id`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(500) NULL,
    `slug` VARCHAR(500) NULL,
    `description` TEXT NULL,
    `description_normal` TEXT NULL,
    `image` MEDIUMTEXT NULL,
    `selling_price` DOUBLE NULL,
    `category_id` INTEGER NULL,
    `unit_id` VARCHAR(5) NULL,
    `warrenty_time_id` INTEGER NULL,
    `views` INTEGER NULL,
    `is_hide` BOOLEAN NULL,
    `status` TINYINT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `category_id`(`category_id`),
    INDEX `unit_id`(`unit_id`),
    INDEX `warrenty_time_id`(`warrenty_time_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `production_batches` (
    `batch_id` INTEGER NOT NULL,
    `production_batch_id` VARCHAR(255) NOT NULL,
    `template_id` INTEGER NULL,
    `quantity` INTEGER NOT NULL,
    `status` VARCHAR(20) NULL DEFAULT 'pending',
    `created_by` VARCHAR(12) NULL,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `approved_by` VARCHAR(12) NULL,
    `approved_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `batch_id`(`batch_id`),
    INDEX `approved_by`(`approved_by`),
    INDEX `created_by`(`created_by`),
    INDEX `template_id`(`template_id`),
    PRIMARY KEY (`batch_id`, `production_batch_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `production_components` (
    `production_component_id` INTEGER NOT NULL AUTO_INCREMENT,
    `production_id` INTEGER NULL,
    `component_id` INTEGER NULL,
    `quantity_used` INTEGER NULL DEFAULT 1,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    INDEX `component_id`(`component_id`),
    INDEX `production_id`(`production_id`),
    PRIMARY KEY (`production_component_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `production_tracking` (
    `production_id` INTEGER NOT NULL AUTO_INCREMENT,
    `batch_id` INTEGER NULL,
    `device_serial` VARCHAR(50) NULL,
    `stage` VARCHAR(50) NOT NULL,
    `status` VARCHAR(20) NULL DEFAULT 'pending',
    `employee_id` VARCHAR(12) NULL,
    `started_at` DATETIME(0) NULL,
    `completed_at` DATETIME(0) NULL,
    `cost` DECIMAL(10, 2) NULL,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    INDEX `batch_id`(`batch_id`),
    INDEX `device_serial`(`device_serial`),
    INDEX `employee_id`(`employee_id`),
    PRIMARY KEY (`production_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_product` (
    `id` INTEGER NOT NULL,
    `review_id` INTEGER NULL,
    `customer_id` VARCHAR(12) NULL,
    `product_id` INTEGER NULL,
    `comment` TEXT NULL,
    `image` MEDIUMTEXT NULL,
    `rating` TINYINT NULL,
    `response` VARCHAR(500) NULL,
    `note` VARCHAR(500) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `customer_id`(`customer_id`),
    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` VARCHAR(5) NOT NULL,
    `name` VARCHAR(500) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `share_requests` (
    `request_id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_serial` VARCHAR(50) NULL,
    `from_user_id` VARCHAR(12) NULL,
    `to_user_id` VARCHAR(12) NULL,
    `permission_type` VARCHAR(20) NULL DEFAULT 'readonly',
    `status` VARCHAR(20) NULL DEFAULT 'pending',
    `requested_at` DATETIME(0) NULL DEFAULT (now()),
    `approved_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    INDEX `device_serial`(`device_serial`),
    INDEX `from_user_id`(`from_user_id`),
    INDEX `to_user_id`(`to_user_id`),
    PRIMARY KEY (`request_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shared_permissions` (
    `permission_id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_serial` VARCHAR(50) NULL,
    `shared_with_user_id` VARCHAR(12) NULL,
    `permission_type` VARCHAR(20) NULL DEFAULT 'readonly',
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    INDEX `device_serial`(`device_serial`),
    INDEX `shared_with_user_id`(`shared_with_user_id`),
    PRIMARY KEY (`permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `slideshow` (
    `id` INTEGER NOT NULL,
    `text_button` VARCHAR(500) NULL,
    `link` VARCHAR(500) NULL,
    `image` MEDIUMTEXT NULL,
    `status` TINYINT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `spaces` (
    `space_id` INTEGER NOT NULL AUTO_INCREMENT,
    `house_id` INTEGER NULL,
    `name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    INDEX `house_id`(`house_id`),
    PRIMARY KEY (`space_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sync_tracking` (
    `sync_id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` VARCHAR(12) NULL,
    `user_device_id` INTEGER NULL,
    `ip_address` VARCHAR(45) NULL,
    `last_synced_at` DATETIME(0) NULL,
    `sync_type` VARCHAR(20) NULL,
    `sync_status` VARCHAR(20) NULL,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    INDEX `account_id`(`account_id`),
    INDEX `user_device_id`(`user_device_id`),
    PRIMARY KEY (`sync_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `template_components` (
    `template_component_id` INTEGER NOT NULL AUTO_INCREMENT,
    `template_id` INTEGER NULL,
    `component_id` INTEGER NULL,
    `quantity_required` INTEGER NULL DEFAULT 1,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    INDEX `component_id`(`component_id`),
    INDEX `template_id`(`template_id`),
    PRIMARY KEY (`template_component_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_types` (
    `ticket_type_id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_name` VARCHAR(50) NOT NULL,
    `priority` INTEGER NULL DEFAULT 1,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`ticket_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tickets` (
    `ticket_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(12) NULL,
    `device_serial` VARCHAR(50) NULL,
    `ticket_type_id` INTEGER NOT NULL,
    `description` TEXT NULL,
    `evidence` JSON NULL,
    `status` VARCHAR(20) NULL DEFAULT 'pending',
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `assigned_to` VARCHAR(12) NULL,
    `resolved_at` DATETIME(0) NULL,
    `resolve_solution` TEXT NULL,
    `is_deleted` BOOLEAN NULL DEFAULT false,

    INDEX `assigned_to`(`assigned_to`),
    INDEX `device_serial`(`device_serial`),
    INDEX `ticket_type_id`(`ticket_type_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`ticket_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unit` (
    `id` VARCHAR(5) NOT NULL,
    `name` VARCHAR(50) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_devices` (
    `user_device_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(12) NULL,
    `device_name` VARCHAR(100) NOT NULL,
    `device_id` VARCHAR(255) NOT NULL,
    `device_token` TEXT NULL,
    `last_login` DATETIME(0) NULL DEFAULT (now()),
    `last_out` DATETIME(0) NULL,
    `created_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`user_device_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_groups` (
    `user_group_id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` VARCHAR(12) NULL,
    `group_id` INTEGER NULL,
    `role` VARCHAR(20) NULL DEFAULT 'member',
    `joined_at` DATETIME(0) NULL DEFAULT (now()),
    `updated_at` DATETIME(0) NULL DEFAULT (now()),
    `is_deleted` BOOLEAN NULL DEFAULT false,

    INDEX `account_id`(`account_id`),
    INDEX `group_id`(`group_id`),
    PRIMARY KEY (`user_group_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warehouse` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(500) NULL,
    `address` VARCHAR(500) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warehouse_inventory` (
    `id` INTEGER NOT NULL,
    `product_id` INTEGER NULL,
    `batch_code` VARCHAR(50) NULL,
    `stock` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warrenty_time` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(150) NULL,
    `time` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `address_book` ADD CONSTRAINT `address_book_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `alerts` ADD CONSTRAINT `alerts_ibfk_1` FOREIGN KEY (`device_serial`) REFERENCES `devices`(`serial_number`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `alerts` ADD CONSTRAINT `alerts_ibfk_2` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`space_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `alerts` ADD CONSTRAINT `alerts_ibfk_3` FOREIGN KEY (`alert_type_id`) REFERENCES `alert_types`(`alert_type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `attribute` ADD CONSTRAINT `attribute_ibfk_1` FOREIGN KEY (`group_attribute_id`) REFERENCES `attribute_group`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `attribute_category` ADD CONSTRAINT `attribute_category_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `attribute_category` ADD CONSTRAINT `attribute_category_ibfk_2` FOREIGN KEY (`attribute_id`) REFERENCES `attribute`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `attribute_product` ADD CONSTRAINT `attribute_product_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `attribute_product` ADD CONSTRAINT `attribute_product_ibfk_2` FOREIGN KEY (`attribute_id`) REFERENCES `attribute`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `batch_product_detail` ADD CONSTRAINT `batch_product_detail_ibfk_1` FOREIGN KEY (`imp_batch_id`) REFERENCES `detail_import`(`batch_code`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `batch_product_detail` ADD CONSTRAINT `batch_product_detail_ibfk_2` FOREIGN KEY (`exp_batch_id`) REFERENCES `detail_export`(`batch_code`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `blog` ADD CONSTRAINT `blog_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `blog` ADD CONSTRAINT `blog_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories`(`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detail_export` ADD CONSTRAINT `detail_export_ibfk_1` FOREIGN KEY (`export_id`) REFERENCES `export_warehouse`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detail_export` ADD CONSTRAINT `detail_export_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detail_export` ADD CONSTRAINT `detail_export_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detail_import` ADD CONSTRAINT `detail_import_ibfk_1` FOREIGN KEY (`import_id`) REFERENCES `import_warehouse`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detail_import` ADD CONSTRAINT `detail_import_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `device_templates` ADD CONSTRAINT `device_templates_ibfk_1` FOREIGN KEY (`device_type_id`) REFERENCES `categories`(`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `device_templates` ADD CONSTRAINT `device_templates_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `devices` ADD CONSTRAINT `devices_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `device_templates`(`template_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `devices` ADD CONSTRAINT `devices_ibfk_2` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`space_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `devices` ADD CONSTRAINT `devices_ibfk_3` FOREIGN KEY (`account_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `devices` ADD CONSTRAINT `devices_ibfk_4` FOREIGN KEY (`group_id`) REFERENCES `groups`(`group_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `devices` ADD CONSTRAINT `devices_ibfk_5` FOREIGN KEY (`hub_id`) REFERENCES `devices`(`serial_number`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `devices` ADD CONSTRAINT `devices_ibfk_6` FOREIGN KEY (`firmware_id`) REFERENCES `firmware`(`firmware_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `export_warehouse` ADD CONSTRAINT `export_warehouse_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `firmware` ADD CONSTRAINT `firmware_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `device_templates`(`template_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `firmware_update_history` ADD CONSTRAINT `firmware_update_history_ibfk_1` FOREIGN KEY (`device_serial`) REFERENCES `devices`(`serial_number`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `firmware_update_history` ADD CONSTRAINT `firmware_update_history_ibfk_2` FOREIGN KEY (`firmware_id`) REFERENCES `firmware`(`firmware_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hourly_values` ADD CONSTRAINT `hourly_values_ibfk_1` FOREIGN KEY (`device_serial`) REFERENCES `devices`(`serial_number`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hourly_values` ADD CONSTRAINT `hourly_values_ibfk_2` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`space_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `houses` ADD CONSTRAINT `houses_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups`(`group_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `image_product` ADD CONSTRAINT `image_product_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `import_warehouse` ADD CONSTRAINT `import_warehouse_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `import_warehouse` ADD CONSTRAINT `import_warehouse_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `liked` ADD CONSTRAINT `liked_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `liked` ADD CONSTRAINT `liked_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`saler_id`) REFERENCES `employee`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_ibfk_3` FOREIGN KEY (`shipper_id`) REFERENCES `employee`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_detail` ADD CONSTRAINT `order_detail_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_detail` ADD CONSTRAINT `order_detail_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ownership_history` ADD CONSTRAINT `ownership_history_ibfk_1` FOREIGN KEY (`approved_request_id`) REFERENCES `share_requests`(`request_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ownership_history` ADD CONSTRAINT `ownership_history_ibfk_2` FOREIGN KEY (`device_serial`) REFERENCES `devices`(`serial_number`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ownership_history` ADD CONSTRAINT `ownership_history_ibfk_3` FOREIGN KEY (`from_user_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ownership_history` ADD CONSTRAINT `ownership_history_ibfk_4` FOREIGN KEY (`to_user_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `payment_info` ADD CONSTRAINT `payment_info_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `permission_role` ADD CONSTRAINT `permission_role_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `permission_role` ADD CONSTRAINT `permission_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_ibfk_3` FOREIGN KEY (`warrenty_time_id`) REFERENCES `warrenty_time`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `production_batches` ADD CONSTRAINT `production_batches_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `device_templates`(`template_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `production_batches` ADD CONSTRAINT `production_batches_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `production_batches` ADD CONSTRAINT `production_batches_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `production_components` ADD CONSTRAINT `production_components_ibfk_1` FOREIGN KEY (`production_id`) REFERENCES `production_tracking`(`production_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `production_components` ADD CONSTRAINT `production_components_ibfk_2` FOREIGN KEY (`component_id`) REFERENCES `components`(`component_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `production_tracking` ADD CONSTRAINT `production_tracking_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `production_batches`(`batch_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `production_tracking` ADD CONSTRAINT `production_tracking_ibfk_2` FOREIGN KEY (`device_serial`) REFERENCES `devices`(`serial_number`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `production_tracking` ADD CONSTRAINT `production_tracking_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `review_product` ADD CONSTRAINT `review_product_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `review_product` ADD CONSTRAINT `review_product_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `share_requests` ADD CONSTRAINT `share_requests_ibfk_1` FOREIGN KEY (`device_serial`) REFERENCES `devices`(`serial_number`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `share_requests` ADD CONSTRAINT `share_requests_ibfk_2` FOREIGN KEY (`from_user_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `share_requests` ADD CONSTRAINT `share_requests_ibfk_3` FOREIGN KEY (`to_user_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `shared_permissions` ADD CONSTRAINT `shared_permissions_ibfk_1` FOREIGN KEY (`device_serial`) REFERENCES `devices`(`serial_number`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `shared_permissions` ADD CONSTRAINT `shared_permissions_ibfk_2` FOREIGN KEY (`shared_with_user_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `spaces` ADD CONSTRAINT `spaces_ibfk_1` FOREIGN KEY (`house_id`) REFERENCES `houses`(`house_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sync_tracking` ADD CONSTRAINT `sync_tracking_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sync_tracking` ADD CONSTRAINT `sync_tracking_ibfk_2` FOREIGN KEY (`user_device_id`) REFERENCES `user_devices`(`user_device_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `template_components` ADD CONSTRAINT `template_components_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `device_templates`(`template_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `template_components` ADD CONSTRAINT `template_components_ibfk_2` FOREIGN KEY (`component_id`) REFERENCES `components`(`component_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`device_serial`) REFERENCES `devices`(`serial_number`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`ticket_type_id`) REFERENCES `ticket_types`(`ticket_type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_ibfk_4` FOREIGN KEY (`assigned_to`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_devices` ADD CONSTRAINT `user_devices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_groups` ADD CONSTRAINT `user_groups_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_groups` ADD CONSTRAINT `user_groups_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `groups`(`group_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `warehouse_inventory` ADD CONSTRAINT `warehouse_inventory_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

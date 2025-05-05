-- AlterTable
ALTER TABLE `alert_types` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `alerts` MODIFY `timestamp` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `attribute_category` MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `components` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `device_templates` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `devices` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

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
ALTER TABLE `ownership_history` MODIFY `transferred_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `production_batches` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `production_components` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `production_tracking` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `share_requests` MODIFY `requested_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `shared_permissions` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `spaces` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `sync_tracking` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `template_components` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `ticket_types` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `tickets` MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `user_devices` MODIFY `last_login` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `created_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

-- AlterTable
ALTER TABLE `user_groups` MODIFY `joined_at` DATETIME(0) NULL DEFAULT (now()),
    MODIFY `updated_at` DATETIME(0) NULL DEFAULT (now());

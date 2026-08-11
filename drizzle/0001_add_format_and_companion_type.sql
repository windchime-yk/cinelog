-- NOTE: db/schema.ts は id を serial(bigint unsigned) として宣言しているが、
-- 実DBの tbl_movieinfo / tbl_theater は int(10) unsigned で作られている
-- (db/sql/dump_main_*/ 参照)。MySQL/TiDB は外部キーと参照先の型・符号の完全一致を
-- 要求するため、ここでは実DBに合わせて int(10) unsigned で作成している。
-- schema.ts の宣言と意図的に食い違っているので serial に「直さない」こと。

CREATE TABLE `tbl_format` (
	`id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
	`name` varchar(246) NOT NULL COMMENT '鑑賞形式',
	PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
	UNIQUE KEY `id` (`id`),
	UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin /*T![auto_id_cache] AUTO_ID_CACHE=1 */;
--> statement-breakpoint
CREATE TABLE `tbl_companion_type` (
	`id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
	`name` varchar(246) NOT NULL COMMENT '同伴者分類',
	PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
	UNIQUE KEY `id` (`id`),
	UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin /*T![auto_id_cache] AUTO_ID_CACHE=1 */;
--> statement-breakpoint
ALTER TABLE `tbl_movieinfo` ADD COLUMN `format_id` int(10) unsigned DEFAULT NULL COMMENT '鑑賞形式テーブルID' AFTER `theater_id`;
--> statement-breakpoint
ALTER TABLE `tbl_movieinfo` ADD COLUMN `companion_type_id` int(10) unsigned DEFAULT NULL COMMENT '同伴者分類テーブルID' AFTER `accompanier`;
--> statement-breakpoint
ALTER TABLE `tbl_movieinfo` ADD INDEX `fk_2` (`format_id`);
--> statement-breakpoint
ALTER TABLE `tbl_movieinfo` ADD INDEX `fk_3` (`companion_type_id`);
--> statement-breakpoint
ALTER TABLE `tbl_movieinfo` ADD CONSTRAINT `fk_2` FOREIGN KEY (`format_id`) REFERENCES `tbl_format` (`id`);
--> statement-breakpoint
ALTER TABLE `tbl_movieinfo` ADD CONSTRAINT `fk_3` FOREIGN KEY (`companion_type_id`) REFERENCES `tbl_companion_type` (`id`);

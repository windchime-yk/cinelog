/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `tbl_movieinfo` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `title` varchar(246) NOT NULL COMMENT '作品タイトル',
  `is_dubbed` tinyint(1) NOT NULL COMMENT '吹替版かどうか',
  `is_domestic` tinyint(1) NOT NULL COMMENT '国内映画かどうか',
  `is_live_action` tinyint(1) NOT NULL COMMENT '実写かどうか',
  `theater_id` int unsigned NOT NULL COMMENT '上映館テーブルID',
  `format_id` int unsigned DEFAULT NULL COMMENT '鑑賞形式テーブルID',
  `view_start_datetime` datetime NOT NULL COMMENT '上映開始日時',
  `view_end_datetime` datetime NOT NULL COMMENT '上映終了日時',
  `accompanier` int unsigned DEFAULT NULL COMMENT '同伴者数',
  `companion_type_id` int unsigned DEFAULT NULL COMMENT '同伴者分類テーブルID',
  `rating` int unsigned DEFAULT NULL COMMENT '5段階評価',
  `comment` text DEFAULT NULL COMMENT 'コメント',
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `id` (`id`),
  KEY `fk_1` (`theater_id`),
  KEY `fk_2` (`format_id`),
  KEY `fk_3` (`companion_type_id`),
  CONSTRAINT `fk_1` FOREIGN KEY (`theater_id`) REFERENCES `tbl_theater` (`id`),
  CONSTRAINT `fk_2` FOREIGN KEY (`format_id`) REFERENCES `tbl_format` (`id`),
  CONSTRAINT `fk_3` FOREIGN KEY (`companion_type_id`) REFERENCES `tbl_companion_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=32194 /*T![auto_id_cache] AUTO_ID_CACHE=1 */;

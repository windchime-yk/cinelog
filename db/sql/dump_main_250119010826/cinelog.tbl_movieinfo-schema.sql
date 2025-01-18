/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `tbl_movieinfo` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `title` varchar(246) NOT NULL COMMENT '作品タイトル',
  `is_dubbed` tinyint(1) NOT NULL COMMENT '吹替版かどうか',
  `is_domestic` tinyint(1) NOT NULL COMMENT '国内映画かどうか',
  `is_live_action` tinyint(1) NOT NULL COMMENT '実写かどうか',
  `theater_id` int(10) unsigned NOT NULL COMMENT '上映館テーブルID',
  `view_start_datetime` datetime NOT NULL COMMENT '上映開始日時',
  `view_end_datetime` datetime NOT NULL COMMENT '上映終了日時',
  `accompanier` int(10) unsigned DEFAULT NULL COMMENT '同伴者数',
  `rating` int(10) unsigned DEFAULT NULL COMMENT '5段階評価',
  `comment` text DEFAULT NULL COMMENT 'コメント',
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `id` (`id`),
  KEY `fk_1` (`theater_id`),
  CONSTRAINT `fk_1` FOREIGN KEY (`theater_id`) REFERENCES `cinelog`.`tbl_theater` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin /*T![auto_id_cache] AUTO_ID_CACHE=1 */;

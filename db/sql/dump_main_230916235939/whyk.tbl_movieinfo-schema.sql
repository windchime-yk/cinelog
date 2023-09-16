CREATE TABLE `tbl_movieinfo` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `title` varchar(246) NOT NULL COMMENT '作品タイトル',
  `is_dubbed` tinyint(1) DEFAULT NULL COMMENT '吹替版かどうか',
  `is_domestic` tinyint(1) DEFAULT NULL COMMENT '国内映画かどうか',
  `is_live_action` tinyint(1) DEFAULT NULL COMMENT '実写かどうか',
  `theater_id` varchar(246) NOT NULL COMMENT '上映館テーブルID',
  `view_start_datetime` datetime NOT NULL COMMENT '上映開始日時',
  `view_end_datetime` datetime NOT NULL COMMENT '上映終了日時',
  `accompanier` int unsigned DEFAULT NULL COMMENT '同伴者数',
  `rating` int unsigned DEFAULT NULL COMMENT '5段階評価',
  `comment` text COMMENT 'コメント',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

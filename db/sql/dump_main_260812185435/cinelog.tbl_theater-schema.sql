/*!40014 SET FOREIGN_KEY_CHECKS=0*/;
/*!40101 SET NAMES binary*/;
CREATE TABLE `tbl_theater` (
  `id` varchar(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL COMMENT 'ID',
  `name` varchar(246) NOT NULL COMMENT '上映館',
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

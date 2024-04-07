CREATE TABLE `tbl_theater` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(246) NOT NULL COMMENT '上映館',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) AUTO_ID_CACHE=1;

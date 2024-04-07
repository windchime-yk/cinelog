CREATE TABLE `tbl_region` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `region` varchar(246) NOT NULL COMMENT '地域',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) AUTO_ID_CACHE=1;

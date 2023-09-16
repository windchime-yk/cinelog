CREATE TABLE `tbl_region` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `region` varchar(246) NOT NULL COMMENT '地域',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

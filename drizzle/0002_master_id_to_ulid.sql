-- マスタ3テーブルの主キーをAUTO_INCREMENTからULIDへ移行する
--
-- 背景: TiDBの分散採番ではidが連番にならない（実データで最大4000の飛びを確認）。
-- マスタのidは今後URLでの絞り込みに使う可能性があるため、環境に依存しない
-- 安定した識別子にする。tbl_movieinfo.idはアプリから参照されないため据え置く。
--
-- ULIDはこのファイルに直接埋め込んである。移行時に採番するとdevelopとmainで
-- 別のidになるため、両環境で同じ値になるよう静的な値にしている。
--
-- 型は char(26) ではなく ascii の varchar(26) にしている。utf8mb4のままだと
-- 1文字4バイト確保になり、クラスタ化インデックスが不必要に膨らむため。
--
-- 前提: tbl_format と tbl_companion_type が空であること。
--   SELECT COUNT(*) FROM tbl_format;          -- 0
--   SELECT COUNT(*) FROM tbl_companion_type;  -- 0
--
-- 注意: TiDBのDDLはトランザクションにならない。tbl_theaterは最後まで残す順序に
-- してあるが、途中で失敗した場合は下部のロールバック手順を参照すること。

-- 1. 外部キーを外す
ALTER TABLE `tbl_movieinfo` DROP FOREIGN KEY `fk_1`;
--> statement-breakpoint
ALTER TABLE `tbl_movieinfo` DROP FOREIGN KEY `fk_2`;
--> statement-breakpoint
ALTER TABLE `tbl_movieinfo` DROP FOREIGN KEY `fk_3`;
--> statement-breakpoint

-- 2. 空のマスタ2つは作り直す
DROP TABLE `tbl_format`;
--> statement-breakpoint
CREATE TABLE `tbl_format` (
  `id` varchar(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL COMMENT 'ID',
  `name` varchar(246) NOT NULL COMMENT '鑑賞形式',
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
--> statement-breakpoint
DROP TABLE `tbl_companion_type`;
--> statement-breakpoint
CREATE TABLE `tbl_companion_type` (
  `id` varchar(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL COMMENT 'ID',
  `name` varchar(246) NOT NULL COMMENT '同伴者分類',
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
--> statement-breakpoint

-- 3. tbl_theaterを新しい型で作り直す
--    クラスタ化主キーの型変更はTiDBでサポートされないため、作り直すしかない
CREATE TABLE `tbl_theater_new` (
  `id` varchar(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL COMMENT 'ID',
  `name` varchar(246) NOT NULL COMMENT '上映館',
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
--> statement-breakpoint
INSERT INTO `tbl_theater_new` (`id`, `name`) VALUES
  ('01KZRWVJ3F0J3Y8ER5YDT45CGY', 'TOHOシネマズ 府中'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CGZ', 'TOHOシネマズ 日比谷'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CH0', 'TOHOシネマズ 池袋'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CH1', 'グランドシネマサンシャイン 池袋'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CH2', 'ユナイテッド・シネマ アクアシティお台場'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CH3', 'ユナイテッド・シネマ 入間'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CH4', '新所沢レッツシネパーク'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CH5', '池袋HUMAXシネマズ'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CH6', 'kino cinema 立川高島屋S.C.館'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CH7', '立川シネマシティ シネマ・ツー'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CH8', 'TOHOシネマズ 立川立飛'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CH9', 'TOHOシネマズ シャンテ'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CHA', 'ユナイテッド・シネマ 豊洲'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CHB', '立川シネマシティ シネマ・ワン'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CHC', 'シネ・リーブル池袋'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CHD', 'チネチッタ'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CHE', '109シネマズプレミアム新宿'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CHF', 'T・ジョイ エミテラス所沢'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CHG', '新宿ピカデリー'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CHH', 'TOHOシネマズ 日本橋'),
  ('01KZRWVJ3F0J3Y8ER5YDT45CHJ', 'ユナイテッド・シネマ としまえん');
--> statement-breakpoint

-- 4. movieinfoの外部キー列をvarchar化する（intの値は'1','2'...の文字列になる）
ALTER TABLE `tbl_movieinfo` MODIFY COLUMN `theater_id` varchar(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL COMMENT '上映館テーブルID';
--> statement-breakpoint
ALTER TABLE `tbl_movieinfo` MODIFY COLUMN `format_id` varchar(26) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL COMMENT '鑑賞形式テーブルID';
--> statement-breakpoint
ALTER TABLE `tbl_movieinfo` MODIFY COLUMN `companion_type_id` varchar(26) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL COMMENT '同伴者分類テーブルID';
--> statement-breakpoint

-- 5. theater_idを旧idからULIDへ張り替える
UPDATE `tbl_movieinfo` SET `theater_id` = CASE `theater_id`
  WHEN '1' THEN '01KZRWVJ3F0J3Y8ER5YDT45CGY'
  WHEN '2' THEN '01KZRWVJ3F0J3Y8ER5YDT45CGZ'
  WHEN '3' THEN '01KZRWVJ3F0J3Y8ER5YDT45CH0'
  WHEN '4' THEN '01KZRWVJ3F0J3Y8ER5YDT45CH1'
  WHEN '5' THEN '01KZRWVJ3F0J3Y8ER5YDT45CH2'
  WHEN '6' THEN '01KZRWVJ3F0J3Y8ER5YDT45CH3'
  WHEN '7' THEN '01KZRWVJ3F0J3Y8ER5YDT45CH4'
  WHEN '8' THEN '01KZRWVJ3F0J3Y8ER5YDT45CH5'
  WHEN '9' THEN '01KZRWVJ3F0J3Y8ER5YDT45CH6'
  WHEN '10' THEN '01KZRWVJ3F0J3Y8ER5YDT45CH7'
  WHEN '11' THEN '01KZRWVJ3F0J3Y8ER5YDT45CH8'
  WHEN '12' THEN '01KZRWVJ3F0J3Y8ER5YDT45CH9'
  WHEN '13' THEN '01KZRWVJ3F0J3Y8ER5YDT45CHA'
  WHEN '14' THEN '01KZRWVJ3F0J3Y8ER5YDT45CHB'
  WHEN '15' THEN '01KZRWVJ3F0J3Y8ER5YDT45CHC'
  WHEN '16' THEN '01KZRWVJ3F0J3Y8ER5YDT45CHD'
  WHEN '17' THEN '01KZRWVJ3F0J3Y8ER5YDT45CHE'
  WHEN '18' THEN '01KZRWVJ3F0J3Y8ER5YDT45CHF'
  WHEN '19' THEN '01KZRWVJ3F0J3Y8ER5YDT45CHG'
  WHEN '20' THEN '01KZRWVJ3F0J3Y8ER5YDT45CHH'
  WHEN '21' THEN '01KZRWVJ3F0J3Y8ER5YDT45CHJ'
  ELSE `theater_id`
END;
--> statement-breakpoint

-- 6. 旧テーブルを入れ替える
DROP TABLE `tbl_theater`;
--> statement-breakpoint
RENAME TABLE `tbl_theater_new` TO `tbl_theater`;
--> statement-breakpoint

-- 7. 外部キーを張り直す
ALTER TABLE `tbl_movieinfo` ADD CONSTRAINT `fk_1` FOREIGN KEY (`theater_id`) REFERENCES `tbl_theater` (`id`);
--> statement-breakpoint
ALTER TABLE `tbl_movieinfo` ADD CONSTRAINT `fk_2` FOREIGN KEY (`format_id`) REFERENCES `tbl_format` (`id`);
--> statement-breakpoint
ALTER TABLE `tbl_movieinfo` ADD CONSTRAINT `fk_3` FOREIGN KEY (`companion_type_id`) REFERENCES `tbl_companion_type` (`id`);

-- 適用後の確認:
--   SELECT COUNT(*) FROM tbl_theater;                                    -- 21
--   SELECT COUNT(*) FROM tbl_movieinfo WHERE LENGTH(theater_id) <> 26;   -- 0
--   SELECT COUNT(*) FROM tbl_movieinfo m
--     LEFT JOIN tbl_theater t ON m.theater_id = t.id WHERE t.id IS NULL; -- 0
--
-- 途中で失敗した場合:
--   6の実行前なら tbl_theater は無傷。tbl_theater_new を捨てて、
--   4で変換した theater_id を元のintに戻せば復旧できる（CASEの逆引き）。
--   6の実行後に失敗した場合は、このファイルのINSERT文とdumpから再構築する。

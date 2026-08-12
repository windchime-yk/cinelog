-- 本人の記憶にもとづき同伴者分類を遡って登録する
--
-- 対象3件。同伴者数はいずれも1名。
--
--   id=16195  2026-06-13  臨時増発 ミルキー☆サブウェイ 各駅停車劇場行き  → 恋人
--   id=100  2022-12-25  すずめの戸締まり  → 恋人
--   id=91  2022-10-08  夏へのトンネル、さよならの出口  → 友人
--
-- id=16195 は同伴者数がNULLだったため1も併せて設定する。他の2件は既に1が
-- 入っており、同じ値をセットするだけなので影響はない。
--
-- 前提:
--   drizzle/0002_master_id_to_ulid.sql  適用済み（companion_type_idがvarchar(26)であること）
--   db/sql/seed_companion_type.sql      適用済み（4件のマスタが入っていること）
--
-- 特定はタイトルと上映開始日時の組で行う。「すずめの戸締まり」は2回、
-- 「夏へのトンネル、さよならの出口」は3回観ておりタイトルだけでは足りない。
-- 同名の他の回はいずれも同伴者数がNULL（一人で鑑賞）で、今回の対象ではない。
--
-- スカラーサブクエリではなくJOINにしてあるので、マスタ側の名称が存在しない場合は
-- 更新0件になるだけで、companion_type_idがNULLで上書きされることはない。

-- 恋人（2件）
UPDATE `tbl_movieinfo` `m`
JOIN `tbl_companion_type` `c` ON `c`.`name` = '恋人'
SET
  `m`.`companion_type_id` = `c`.`id`,
  `m`.`accompanier` = 1
WHERE (`m`.`title`, `m`.`view_start_datetime`) IN (
    ('臨時増発 ミルキー☆サブウェイ 各駅停車劇場行き', '2026-06-13 17:30:00'),
    ('すずめの戸締まり', '2022-12-25 10:05:00')
);

-- 友人（1件）
UPDATE `tbl_movieinfo` `m`
JOIN `tbl_companion_type` `c` ON `c`.`name` = '友人'
SET
  `m`.`companion_type_id` = `c`.`id`,
  `m`.`accompanier` = 1
WHERE (`m`.`title`, `m`.`view_start_datetime`) IN (
    ('夏へのトンネル、さよならの出口', '2022-10-08 13:50:00')
);

-- 確認
SELECT
  `m`.`id`,
  `m`.`title`,
  `m`.`view_start_datetime`,
  `m`.`accompanier`,
  `c`.`name` AS `companion_type`
FROM `tbl_movieinfo` `m`
JOIN `tbl_companion_type` `c` ON `c`.`id` = `m`.`companion_type_id`
ORDER BY `m`.`view_start_datetime`;

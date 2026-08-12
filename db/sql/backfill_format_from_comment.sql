-- コメントから判明した鑑賞形式を format_id に遡って登録する
--
-- 既存レコードのコメント19件のうち15件が上映形式に言及していたため、
-- その内容にもとづいて format_id を埋める。残る4件は舞台挨拶・感想・同伴者・
-- 時刻の話で、形式は特定できないためNULLのままにする。
--
-- コメントには「IMAX」としか書かれていないため、種別は館の設備から特定した。
--   T・ジョイ エミテラス所沢        スクリーン2 / 4Kレーザー投影 + 12chサウンド
--   ユナイテッド・シネマ としまえん  No.8スクリーン / 4Kレーザー投影 + 12chサウンド
-- どちらもIMAXレーザーであり、GTではない。
-- https://www.phileweb.com/news/d-av/202404/18/60205.html
-- https://www.unitedcinemas.jp/imax/imax_laser.html
--
-- 立川シネマシティは2025年12月12日公開作品から02システムに移行しているため、
-- 上映開始日で旧称と02を振り分けてある。
--
-- 前提:
--   drizzle/0002_master_id_to_ulid.sql  適用済み（format_idがvarchar(26)であること）
--   db/sql/seed_format.sql              適用済み（29件のマスタが入っていること）
--
-- 特定はタイトルと上映開始日時の組で行う。全件が一意に決まることを確認済み。
-- 「超かぐや姫！」のように同一作品を複数回・別形式で観ているものがあるため、
-- タイトルだけでは足りない。
--
-- スカラーサブクエリではなくJOINにしてあるので、マスタ側の名称が存在しない場合は
-- 更新0件になるだけで、format_idがNULLで上書きされることはない。

-- IMAXレーザー（8件）
UPDATE `tbl_movieinfo` `m`
JOIN `tbl_format` `f` ON `f`.`name` = 'IMAXレーザー'
SET `m`.`format_id` = `f`.`id`
WHERE (`m`.`title`, `m`.`view_start_datetime`) IN (
    ('ジョーカー：フォリ・ア・ドゥ', '2024-10-15 14:15:00'),
    ('ヴェノム：ザ・ラストダンス', '2024-10-25 21:10:00'),
    ('機動戦士Gundam GQuuuuuuX -Beginning-', '2025-01-26 17:10:00'),
    ('劇場版「鬼滅の刃」無限城編 第一章 猗窩座再来', '2025-08-15 17:45:00'),
    ('ヒックとドラゴン', '2025-09-07 17:30:00'),
    ('機動戦士ガンダム 閃光のハサウェイ キルケーの魔女', '2026-02-06 21:45:00'),
    ('プロジェクト・ヘイル・メアリー', '2026-03-25 20:10:00'),
    ('スパイダーマン:ブランド・ニュー・デイ', '2026-08-09 16:10:00')
);

-- Dolby Atmos（1件）
UPDATE `tbl_movieinfo` `m`
JOIN `tbl_format` `f` ON `f`.`name` = 'Dolby Atmos'
SET `m`.`format_id` = `f`.`id`
WHERE (`m`.`title`, `m`.`view_start_datetime`) IN (
    ('数分間のエールを', '2024-10-27 09:10:00')
);

-- 極上音響上映（極音）（1件）
UPDATE `tbl_movieinfo` `m`
JOIN `tbl_format` `f` ON `f`.`name` = '極上音響上映（極音）'
SET `m`.`format_id` = `f`.`id`
WHERE (`m`.`title`, `m`.`view_start_datetime`) IN (
    ('楽園追放', '2024-12-08 16:00:00')
);

-- 極上音響上映02（極音02）（3件）
UPDATE `tbl_movieinfo` `m`
JOIN `tbl_format` `f` ON `f`.`name` = '極上音響上映02（極音02）'
SET `m`.`format_id` = `f`.`id`
WHERE (`m`.`title`, `m`.`view_start_datetime`) IN (
    ('国宝', '2025-12-29 11:25:00'),
    ('パプリカ', '2026-01-11 15:55:00'),
    ('超かぐや姫！', '2026-02-20 12:00:00')
);

-- LIVE ZOUND（1件）
UPDATE `tbl_movieinfo` `m`
JOIN `tbl_format` `f` ON `f`.`name` = 'LIVE ZOUND'
SET `m`.`format_id` = `f`.`id`
WHERE (`m`.`title`, `m`.`view_start_datetime`) IN (
    ('超かぐや姫！', '2026-02-25 08:50:00')
);

-- BESTIA enhanced（1件）
UPDATE `tbl_movieinfo` `m`
JOIN `tbl_format` `f` ON `f`.`name` = 'BESTIA enhanced'
SET `m`.`format_id` = `f`.`id`
WHERE (`m`.`title`, `m`.`view_start_datetime`) IN (
    ('超かぐや姫！', '2026-03-28 21:05:00')
);

-- 確認
SELECT
  `f`.`name` AS `format`,
  COUNT(*) AS `count`
FROM `tbl_movieinfo` `m`
JOIN `tbl_format` `f` ON `f`.`id` = `m`.`format_id`
GROUP BY `f`.`name`
ORDER BY `count` DESC, `f`.`name`;

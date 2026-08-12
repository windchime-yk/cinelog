-- is_dubbed を is_subtitled にリネームする
--
-- 背景: 列名とCOMMENTは「吹替版かどうか」だが、ダッシュボードのチェックボックスは
-- 「字幕版か」というラベルで表示されており、字幕版の作品にチェックを入れて
-- 運用していた。つまり保存されている値の意味は「字幕版」である。
--
-- 実データの裏付け:
--   is_dubbed=1 は洋画29件のみ、邦画107件はすべて0
--   2016〜2023年の洋画63件のうち1件だけ、2024〜2026年の洋画33件のうち28件
--   → 2024年から実運用が始まっており、それ以前は実質未記録（デフォルトの0）
--
-- 値の反転(SET is_dubbed = NOT is_dubbed)はしてはいけない。字幕版と吹替版は
-- 排他ではなく、邦画107件はどちらでもない（日本語音声・字幕なし）ため、
-- 反転すると邦画がすべて「吹替版」になってしまう。
--
-- したがってデータには触らず、列名を実態に合わせる。
--
-- 2023年以前の未記録分は0のまま残す。カードにも公開APIにも出ない値のため実害はない。

ALTER TABLE `tbl_movieinfo` CHANGE COLUMN `is_dubbed` `is_subtitled` tinyint(1) NOT NULL COMMENT '字幕版かどうか';

-- 適用後の確認:
--   SHOW CREATE TABLE tbl_movieinfo\G   -- is_subtitled になっていること
--   SELECT COUNT(*) FROM tbl_movieinfo WHERE is_subtitled = 1;                        -- 29
--   SELECT COUNT(*) FROM tbl_movieinfo WHERE is_subtitled = 1 AND is_domestic = 1;    -- 0

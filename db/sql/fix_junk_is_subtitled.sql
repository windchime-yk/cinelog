-- JUNK HEAD / JUNK WORLD の is_subtitled を 1 に修正する
--
-- 背景: この2作は邦画でありながら架空言語で話され日本語字幕が付く例外的な作りだが、
-- どちらも is_subtitled = 0 で登録されていた。
--
--   id=64   2021-06-27  JUNK HEAD
--   id=170  2025-07-21  JUNK WORLD
--
-- 字幕フラグは2024年から運用が始まっており、かつ洋画に対してのみ運用されていた
-- （邦画107件はすべて0）。JUNK HEADは運用開始前で未記録、JUNK WORLDは運用開始後だが
-- 邦画のため字幕欄を見ていなかったものと思われる。
--
-- idではなくタイトルと邦画フラグで特定する。developはmainのdumpから復元しているため
-- 現時点ではidも一致するが、環境に依存しない条件のほうが安全なため。
-- 2作とも該当行は1件ずつで、重複鑑賞の記録は無いことを確認済み。
--
-- 前提: 0003_rename_is_dubbed_to_is_subtitled.sql の適用後に実行すること。
--
-- 2024年以降の邦画49件は未点検のため、同様の見落としが他にもある可能性がある。

UPDATE `tbl_movieinfo`
SET `is_subtitled` = 1
WHERE `title` IN ('JUNK HEAD', 'JUNK WORLD')
  AND `is_domestic` = 1;

SELECT `id`, `title`, `is_subtitled`, `is_domestic`, `view_start_datetime`
FROM `tbl_movieinfo`
WHERE `title` IN ('JUNK HEAD', 'JUNK WORLD')
ORDER BY `view_start_datetime`;

-- ランニング・マンの上映終了日時を実際の時刻に修正する
--
-- 背景: 日付を跨いだ鑑賞を記録できなかった頃の回避策が残っている。
--
--   id=4190  2026-01-30 21:45:00 → 2026-01-30 23:59:00  ランニング・マン
--   comment: 本当は24:10に観終わったけど、システム的に記載できなかった
--
-- 正しくは 2026-01-31 00:10:00。上映時間は 134分 → 145分 になる。
--
-- 終了 <= 開始 で日跨ぎ行を探したときは 23:59 > 21:45 のため検出できず、
-- コメントを読んで初めて判明した。終了時刻が23:5x台の行はこの1件のみで、
-- 他の23時台22件はいずれも23:00〜23:45の妥当な値であることを確認済み。
--
-- タイトルと開始日時で特定する。developはmainのdumpから復元しているため
-- 現時点ではidも一致するが、環境に依存しない条件のほうが安全なため。
--
-- コメントは回避策の経緯として残す。消したい場合は別途UPDATEすること。

UPDATE `tbl_movieinfo`
SET `view_end_datetime` = '2026-01-31 00:10:00'
WHERE `title` = 'ランニング・マン'
  AND `view_start_datetime` = '2026-01-30 21:45:00';

SELECT
  `id`,
  `title`,
  `view_start_datetime`,
  `view_end_datetime`,
  TIMESTAMPDIFF(MINUTE, `view_start_datetime`, `view_end_datetime`) AS `minutes`
FROM `tbl_movieinfo`
WHERE `title` = 'ランニング・マン';

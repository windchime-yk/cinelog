-- tbl_format の初期データ
--
-- 通常上映は format_id = NULL で表すため、この表には特殊形式のみを入れる。
-- 1鑑賞に1形式（tbl_movieinfo.format_id）なので、併用は複合名を1行として登録する。
--
-- idは移行時に採番せず静的なULIDを埋め込んである。developとmainで同じidになるため、
-- 将来idをURLに載せて絞り込む場合も環境間で共通のリンクが使える。
--
-- name は UNIQUE 制約付き。INSERT IGNORE にしてあるので、
-- develop と main の両方に流しても、行を足して流し直しても安全。
--
-- ダッシュボードのセレクトボックスは ORDER BY なしで取得しているため、
-- 概ね登録順で表示される。使用頻度の高い順に並べてある。

INSERT IGNORE INTO `tbl_format` (`id`, `name`) VALUES
  ('01KZRWZDYKPJNZFNNJ8WSJWHYB', 'IMAXレーザー'),         -- TOHOシネマズ / ユナイテッド・シネマ豊洲 ほか
  ('01KZRWZDYKPJNZFNNJ8WSJWHYC', 'IMAXレーザー/GT'),      -- グランドシネマサンシャイン池袋（1.43:1）
  ('01KZRWZDYKPJNZFNNJ8WSJWHYD', 'IMAXデジタル'),         -- TOHOシネマズ府中 ほか
  ('01KZRWZDYKPJNZFNNJ8WSJWHYE', 'Dolby Cinema'),
  ('01KZRWZDYKPJNZFNNJ8WSJWHYF', 'TCX'),              -- TOHOシネマズ
  ('01KZRWZDYKPJNZFNNJ8WSJWHYG', 'ULTIRA'),           -- ユナイテッド・シネマ
  ('01KZRWZDYKPJNZFNNJ8WSJWHYH', 'BESTIA'),           -- 109シネマズ
  ('01KZRWZDYKPJNZFNNJ8WSJWHYJ', 'ScreenX'),
  ('01KZRWZDYKPJNZFNNJ8WSJWHYK', '4DX'),
  ('01KZRWZDYKPJNZFNNJ8WSJWHYM', '4DX Screen'),       -- 4DX + ScreenX
  ('01KZRWZDYKPJNZFNNJ8WSJWHYN', 'MX4D'),
  ('01KZRWZDYKPJNZFNNJ8WSJWHYP', 'Dolby Atmos'),
  ('01KZRWZDYKPJNZFNNJ8WSJWHYQ', 'LIVE ZOUND'),       -- チネチッタ
  ('01KZRWZDYKPJNZFNNJ8WSJWHYR', '極上爆音上映'),           -- 立川シネマシティ
  ('01KZRWZDYKPJNZFNNJ8WSJWHYS', '極上音響上映'),           -- 立川シネマシティ
  ('01KZRWZDYKPJNZFNNJ8WSJWHYT', '轟音上映'),             -- TOHOシネマズ
  ('01KZRWZDYKPJNZFNNJ8WSJWHYV', '3D'),
  ('01KZRWZDYKPJNZFNNJ8WSJWHYW', 'IMAXレーザー3D'),
  ('01KZRWZDYKPJNZFNNJ8WSJWHYX', 'IMAXレーザー/GT 3D'),
  ('01KZRWZDYKPJNZFNNJ8WSJWHYY', 'Dolby Cinema 3D'),
  ('01KZRWZDYKPJNZFNNJ8WSJWHYZ', 'ScreenX 3D'),
  ('01KZRWZDYKPJNZFNNJ8WSJWHZ0', '4DX 3D'),
  ('01KZRWZDYKPJNZFNNJ8WSJWHZ1', '4DX Screen 3D'),
  ('01KZRWZDYKPJNZFNNJ8WSJWHZ2', 'MX4D 3D');

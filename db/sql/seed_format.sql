-- tbl_format の初期データ
--
-- 通常上映は format_id = NULL で表すため、この表には特殊形式のみを入れる。
-- 1鑑賞に1形式（tbl_movieinfo.format_id）なので、併用は複合名を1行として登録する。
--
-- 収録内容は登録済み21館の顔ぶれと、既存レコードのコメント19件に出てくる
-- 表記を突き合わせて決めた。コメントでは種別を問わず「IMAX」と書かれていたため
-- 素の「IMAX」を、立川シネマシティは通称「極音」で書かれていたため正式名と
-- 併記した形にしている。
--
-- 舞台挨拶付き特別興行・先行上映・4Kリマスターもコメントに出てくるが、
-- IMAXや極音と併用できる別の軸であり、1列FKに混ぜると組み合わせが爆発するため
-- 含めていない。引き続きコメントで記録する。
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
  ('01KZTD6JQ1757AQ59V56EHY33Q', 'IMAX'),             -- 種別を問わない場合
  ('01KZTD6JQ2D8JXCTEW8MRWA20A', 'IMAXレーザー'),         -- TOHOシネマズ / T・ジョイ / ユナイテッド・シネマ ほか
  ('01KZTD6JQ2D8JXCTEW8MRWA20B', 'IMAXレーザー/GT'),      -- グランドシネマサンシャイン池袋（1.43:1）
  ('01KZTD6JQ2D8JXCTEW8MRWA20C', 'IMAXデジタル'),         -- TOHOシネマズ府中 ほか
  ('01KZTD6JQ2D8JXCTEW8MRWA20D', 'Dolby Cinema'),
  ('01KZTD6JQ2D8JXCTEW8MRWA20E', 'TCX'),              -- TOHOシネマズ
  ('01KZTD6JQ2D8JXCTEW8MRWA20F', 'ULTIRA'),           -- ユナイテッド・シネマ
  ('01KZTD6JQ2D8JXCTEW8MRWA20G', 'BESTIA'),           -- グランドシネマサンシャイン池袋
  ('01KZTD6JQ2D8JXCTEW8MRWA20H', 'BESTIA enhanced'),  -- グランドシネマサンシャイン池袋
  ('01KZTD6JQ2D8JXCTEW8MRWA20J', 'ScreenX'),
  ('01KZTD6JQ2D8JXCTEW8MRWA20K', '4DX'),
  ('01KZTD6JQ2D8JXCTEW8MRWA20M', '4DX Screen'),       -- 4DX + ScreenX
  ('01KZTD6JQ2D8JXCTEW8MRWA20N', 'MX4D'),
  ('01KZTD6JQ2D8JXCTEW8MRWA20P', 'Dolby Atmos'),
  ('01KZTD6JQ2D8JXCTEW8MRWA20Q', 'LIVE ZOUND'),       -- チネチッタ
  ('01KZTD6JQ2D8JXCTEW8MRWA20R', '極上音響上映（極音）'),       -- 立川シネマシティ
  ('01KZTD6JQ2D8JXCTEW8MRWA20S', '極上爆音上映（極爆）'),       -- 立川シネマシティ
  ('01KZTD6JQ2D8JXCTEW8MRWA20T', '轟音上映'),             -- TOHOシネマズ
  ('01KZTD6JQ2D8JXCTEW8MRWA20V', '3D'),
  ('01KZTD6JQ2D8JXCTEW8MRWA20W', 'IMAX 3D'),
  ('01KZTD6JQ2D8JXCTEW8MRWA20X', 'IMAXレーザー3D'),
  ('01KZTD6JQ2D8JXCTEW8MRWA20Y', 'IMAXレーザー/GT 3D'),
  ('01KZTD6JQ2D8JXCTEW8MRWA20Z', 'Dolby Cinema 3D'),
  ('01KZTD6JQ2D8JXCTEW8MRWA210', 'ScreenX 3D'),
  ('01KZTD6JQ2D8JXCTEW8MRWA211', '4DX 3D'),
  ('01KZTD6JQ2D8JXCTEW8MRWA212', '4DX Screen 3D'),
  ('01KZTD6JQ2D8JXCTEW8MRWA213', 'MX4D 3D');

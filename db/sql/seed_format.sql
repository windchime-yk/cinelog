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
-- 立川シネマシティは2025年12月12日公開作品より、独自開発の音響装置[02 system]の
-- 導入にあわせて【極上音響上映02】【極上爆音上映02】へ改称した。設備が異なるため
-- 旧称と02を別の行として持つ。
-- https://ccnews.cinemacity.co.jp/goku-on_goku-baku_02system/
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
  ('01KZTEE58EVES7AYPV4VFKQP8W', 'IMAX'),             -- 種別を問わない場合
  ('01KZTEE58EVES7AYPV4VFKQP8X', 'IMAXレーザー'),         -- TOHOシネマズ / T・ジョイ / ユナイテッド・シネマ ほか
  ('01KZTEE58EVES7AYPV4VFKQP8Y', 'IMAXレーザー/GT'),      -- グランドシネマサンシャイン池袋（1.43:1）
  ('01KZTEE58EVES7AYPV4VFKQP8Z', 'IMAXデジタル'),         -- TOHOシネマズ府中 ほか
  ('01KZTEE58EVES7AYPV4VFKQP90', 'Dolby Cinema'),
  ('01KZTEE58EVES7AYPV4VFKQP91', 'TCX'),              -- TOHOシネマズ
  ('01KZTEE58EVES7AYPV4VFKQP92', 'ULTIRA'),           -- ユナイテッド・シネマ
  ('01KZTEE58EVES7AYPV4VFKQP93', 'BESTIA'),           -- グランドシネマサンシャイン池袋
  ('01KZTEE58EVES7AYPV4VFKQP94', 'BESTIA enhanced'),  -- グランドシネマサンシャイン池袋
  ('01KZTEE58EVES7AYPV4VFKQP95', 'ScreenX'),
  ('01KZTEE58EVES7AYPV4VFKQP96', '4DX'),
  ('01KZTEE58EVES7AYPV4VFKQP97', '4DX Screen'),       -- 4DX + ScreenX
  ('01KZTEE58EVES7AYPV4VFKQP98', 'MX4D'),
  ('01KZTEE58EVES7AYPV4VFKQP99', 'Dolby Atmos'),
  ('01KZTEE58EVES7AYPV4VFKQP9A', 'LIVE ZOUND'),       -- チネチッタ
  ('01KZTEE58EVES7AYPV4VFKQP9B', '極上音響上映02（極音02）'),   -- 立川シネマシティ / 2025-12-12〜
  ('01KZTEE58EVES7AYPV4VFKQP9C', '極上爆音上映02（極爆02）'),   -- 立川シネマシティ / 2025-12-12〜
  ('01KZTEE58EVES7AYPV4VFKQP9D', '極上音響上映（極音）'),       -- 立川シネマシティ / 〜2025-12-11
  ('01KZTEE58EVES7AYPV4VFKQP9E', '極上爆音上映（極爆）'),       -- 立川シネマシティ / 〜2025-12-11
  ('01KZTEE58EVES7AYPV4VFKQP9F', '轟音上映'),             -- TOHOシネマズ
  ('01KZTEE58EVES7AYPV4VFKQP9G', '3D'),
  ('01KZTEE58EVES7AYPV4VFKQP9H', 'IMAX 3D'),
  ('01KZTEE58EVES7AYPV4VFKQP9J', 'IMAXレーザー3D'),
  ('01KZTEE58EVES7AYPV4VFKQP9K', 'IMAXレーザー/GT 3D'),
  ('01KZTEE58EVES7AYPV4VFKQP9M', 'Dolby Cinema 3D'),
  ('01KZTEE58EVES7AYPV4VFKQP9N', 'ScreenX 3D'),
  ('01KZTEE58EVES7AYPV4VFKQP9P', '4DX 3D'),
  ('01KZTEE58EVES7AYPV4VFKQP9Q', '4DX Screen 3D'),
  ('01KZTEE58EVES7AYPV4VFKQP9R', 'MX4D 3D');

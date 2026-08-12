-- tbl_companion_type の初期データ
--
-- 一人で観た場合は companion_type_id = NULL（同伴者数も0ないし未入力）で表すため、
-- この表には同伴者がいた場合の分類のみを入れる。
--
-- idは移行時に採番せず静的なULIDを埋め込んである。developとmainで同じidになるため、
-- 将来idをURLに載せて絞り込む場合も環境間で共通のリンクが使える。
--
-- name は UNIQUE 制約付き。INSERT IGNORE にしてあるので、
-- develop と main の両方に流しても、行を足して流し直しても安全。
--
-- ダッシュボードのセレクトボックスは ORDER BY なしで取得しているため、
-- 概ね登録順で表示される。

INSERT IGNORE INTO `tbl_companion_type` (`id`, `name`) VALUES
  ('01KZRXA796X5YRN6R45J6DXB2Y', '家族'),
  ('01KZRXA796X5YRN6R45J6DXB2Z', '友人'),
  ('01KZRXA796X5YRN6R45J6DXB30', '恋人'),
  ('01KZRXA796X5YRN6R45J6DXB31', '同僚');

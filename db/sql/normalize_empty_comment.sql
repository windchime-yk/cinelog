-- コメントの空文字をNULLに揃える
--
-- 修正前の routes/movie/add.ts は body.get("comment") をそのまま渡していたため、
-- コメント未入力でも空文字が保存されていた。本番データでは203件中72件が該当する。
--
--   NULL      112件
--   空文字     72件  ← これをNULLにする
--   実質あり    6件（cleanup_redundant_comment.sql 適用後）
--
-- 「コメントなし」がNULLと空文字の2通りで表現されており、検索条件が二重になる。
-- rating / accompanier / format_id など他の任意項目はすべてNULLで統一されているため
-- 揃える。insert側は既に comment: body.get("comment") || null に修正済みなので、
-- 今後は空文字が入らない。
--
-- データのみの変更であり、スキーマには影響しない。

UPDATE `tbl_movieinfo`
SET `comment` = NULL
WHERE `comment` = '';

-- 確認
SELECT
  COUNT(*) AS `total`,
  SUM(`comment` IS NULL) AS `null_comment`,
  SUM(`comment` = '') AS `empty_comment`,
  SUM(`comment` IS NOT NULL AND `comment` <> '') AS `real_comment`
FROM `tbl_movieinfo`;

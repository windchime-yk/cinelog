-- 鑑賞作品テーブル作成
CREATE TABLE IF NOT EXISTS tbl_movieinfo (
  id INT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT COMMENT 'ID',
  title VARCHAR(246) NOT NULL COMMENT '作品タイトル',
  is_dubbed BOOLEAN COMMENT '吹替版かどうか',
  is_domestic BOOLEAN COMMENT '国内映画かどうか',
  is_live_action BOOLEAN COMMENT '実写かどうか',
  theater VARCHAR(246) NOT NULL COMMENT '上映館',
  view_date VARCHAR(10) NOT NULL COMMENT '上映日',
  view_start_time VARCHAR(5) COMMENT '上映開始時間',
  view_end_time VARCHAR(5) COMMENT '上映終了時間',
  accompanier INT UNSIGNED COMMENT '同伴者数',
  -- accompanier_type VARCHAR(10)[] COMMENT '同伴者の属性',
  rating INT UNSIGNED COMMENT '5段階評価',
  comment TEXT COMMENT 'コメント',

  PRIMARY KEY (id)
);

-- 初期データ追加
INSERT INTO
  tbl_movieinfo (
    title,
    is_dubbed,
    is_domestic,
    is_live_action,
    theater,
    view_date,
    view_start_time,
    view_end_time,
    accompanier,
    rating,
    comment
  ) VALUES ()

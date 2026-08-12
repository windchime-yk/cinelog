import {
  boolean,
  datetime,
  int,
  mysqlTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

/** ULIDの文字数 */
export const ULID_LENGTH = 26;

export const movieTable = mysqlTable("tbl_movieinfo", {
  /** ID */
  id: serial("id").autoincrement().primaryKey().unique(),
  /** 作品タイトル */
  title: varchar("title", { length: 246 }).notNull(),
  /** 字幕版かどうか */
  is_subtitled: boolean("is_subtitled").notNull(),
  /** 国内映画かどうか */
  is_domestic: boolean("is_domestic").notNull(),
  /** 実写かどうか */
  is_live_action: boolean("is_live_action").notNull(),
  /** 上映館テーブルID */
  theater_id: varchar("theater_id", { length: ULID_LENGTH })
    .notNull()
    .references(() => theaterTable.id),
  /** 鑑賞形式テーブルID */
  format_id: varchar("format_id", { length: ULID_LENGTH })
    .references(() => formatTable.id),
  /** 上映開始日時 */
  view_start_datetime: datetime("view_start_datetime", { mode: "string" })
    .notNull(),
  /** 上映終了日時 */
  view_end_datetime: datetime("view_end_datetime", { mode: "string" })
    .notNull(),
  /** 同伴者数 */
  accompanier: int("accompanier"),
  /** 同伴者分類テーブルID */
  companion_type_id: varchar("companion_type_id", { length: ULID_LENGTH })
    .references(() => companionTypeTable.id),
  /** 5段階評価 */
  rating: int("rating"),
  /** コメント */
  comment: text("comment"),
});

export const theaterTable = mysqlTable("tbl_theater", {
  /** ID */
  id: varchar("id", { length: ULID_LENGTH }).primaryKey(),
  /** 上映館 */
  name: varchar("name", { length: 246 }).notNull().unique(),
});

export const formatTable = mysqlTable("tbl_format", {
  /** ID */
  id: varchar("id", { length: ULID_LENGTH }).primaryKey(),
  /** 鑑賞形式 */
  name: varchar("name", { length: 246 }).notNull().unique(),
});

export const companionTypeTable = mysqlTable("tbl_companion_type", {
  /** ID */
  id: varchar("id", { length: ULID_LENGTH }).primaryKey(),
  /** 同伴者分類 */
  name: varchar("name", { length: 246 }).notNull().unique(),
});

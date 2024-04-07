import {
  boolean,
  datetime,
  int,
  mysqlTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const movieTable = mysqlTable("tbl_movieinfo", {
  /** ID */
  id: serial("id").autoincrement().primaryKey().unique(),
  /** 作品タイトル */
  title: varchar("title", { length: 246 }).notNull(),
  /** 吹替版かどうか */
  is_dubbed: boolean("is_dubbed").notNull(),
  /** 国内映画かどうか */
  is_domestic: boolean("is_domestic").notNull(),
  /** 実写かどうか */
  is_live_action: boolean("is_live_action").notNull(),
  /** 上映館テーブルID */
  theater_id: int("theater_id").notNull().references(() => theaterTable.id),
  /** 上映開始日時 */
  view_start_datetime: datetime("view_start_datetime", { mode: "string" })
    .notNull(),
  /** 上映終了日時 */
  view_end_datetime: datetime("view_end_datetime", { mode: "string" })
    .notNull(),
  /** 同伴者数 */
  accompanier: int("accompanier"),
  /** 5段階評価 */
  rating: int("rating"),
  /** コメント */
  comment: text("comment"),
});

export const theaterTable = mysqlTable("tbl_theater", {
  /** ID */
  id: serial("id").autoincrement().primaryKey().unique(),
  /** 上映館 */
  name: varchar("name", { length: 246 }).notNull().unique(),
});

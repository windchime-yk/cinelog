import { type InferModel } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { theaterTable } from "~/db/schema/theater.ts";

export const movieTable = mysqlTable("tbl_movieinfo", {
  /** ID */
  id: serial("id").autoincrement().primaryKey().unique(),
  /** 作品タイトル */
  title: varchar("title", { length: 246 }).notNull(),
  /** 吹替版かどうか */
  is_dubbed: boolean("is_dubbed"),
  /** 国内映画かどうか */
  is_domestic: boolean("is_domestic"),
  /** 実写かどうか */
  is_live_action: boolean("is_live_action"),
  /** 上映館テーブルID */
  theater_id: int("theater_id").notNull().references(() => theaterTable.id),
  /** 上映日 */
  view_date: varchar("view_date", { length: 10 }).notNull(),
  /** 上映開始時間 */
  view_start_time: varchar("view_start_time", { length: 5 }),
  /** 上映終了時間 */
  view_end_time: varchar("view_end_time", { length: 5 }),
  /** 同伴者数 */
  accompanier: int("accompanier"),
  /** 5段階評価 */
  rating: int("rating"),
  /** コメント */
  comment: text("comment"),
});

export type Movie = InferModel<typeof movieTable>;
export type PickMovie = Pick<
  Movie,
  "title" | "view_date" | "view_start_time" | "view_end_time"
>;
export type PickApiMovie = Pick<Movie, "title" | "view_date">;
export type NewMovie = InferModel<typeof movieTable, "insert">;

export const validateInsertMovieSchema = (movie: NewMovie) => {
  return createInsertSchema(movieTable).safeParse(movie);
};

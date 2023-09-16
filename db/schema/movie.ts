import { type InferModel } from "drizzle-orm";
import {
  boolean,
  datetime,
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

export type Movie = InferModel<typeof movieTable>;
export type PickMovie = Pick<Movie, "title"> & {
  view_date: string;
  diff: string;
};
export type PickApiMovie = Pick<Movie, "title"> & {
  view_date: string;
};
export type NewMovie = InferModel<typeof movieTable, "insert">;

export const validateInsertMovieSchema = (movie: NewMovie) => {
  return createInsertSchema(movieTable).safeParse(movie);
};

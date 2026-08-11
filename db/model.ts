import { type InferModel } from "drizzle-orm";
import {
  companionTypeTable,
  formatTable,
  movieTable,
  theaterTable,
} from "~/db/schema.ts";

export type Movie = InferModel<typeof movieTable>;
export type PickMovie = Pick<Movie, "title"> & {
  view_date: string;
  diff: number;
};
export type PickApiMovie = Pick<Movie, "title"> & {
  view_date: string;
};
export type NewMovie = InferModel<typeof movieTable, "insert">;

export type Theater = InferModel<typeof theaterTable>;
export type NewTheater = InferModel<typeof theaterTable, "insert">;

export type Format = InferModel<typeof formatTable>;
export type NewFormat = InferModel<typeof formatTable, "insert">;

export type CompanionType = InferModel<typeof companionTypeTable>;
export type NewCompanionType = InferModel<
  typeof companionTypeTable,
  "insert"
>;

/** マスタテーブル共通のセレクトボックス用レコード */
export type MasterRecord = Pick<Theater, "id" | "name">;

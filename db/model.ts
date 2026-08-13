import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import {
  companionTypeTable,
  formatTable,
  movieTable,
  theaterTable,
} from "~/db/schema.ts";

export type Movie = InferSelectModel<typeof movieTable>;
export type PickMovie =
  & Pick<Movie, "title" | "is_subtitled" | "is_domestic">
  & {
    view_date: string;
    diff: number;
    /** 鑑賞形式の名称。指定なしの場合はnull */
    format: string | null;
  };
export type PickApiMovie = Pick<Movie, "title"> & {
  view_date: string;
};
export type NewMovie = InferInsertModel<typeof movieTable>;

export type Theater = InferSelectModel<typeof theaterTable>;
export type NewTheater = InferInsertModel<typeof theaterTable>;

export type Format = InferSelectModel<typeof formatTable>;
export type NewFormat = InferInsertModel<typeof formatTable>;

export type CompanionType = InferSelectModel<typeof companionTypeTable>;
export type NewCompanionType = InferInsertModel<typeof companionTypeTable>;

/** マスタテーブル共通のセレクトボックス用レコード */
export type MasterRecord = Pick<Theater, "id" | "name">;

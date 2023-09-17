import { type InferModel } from "drizzle-orm";
import { movieTable, theaterTable } from "~/db/schema.ts";

export type Movie = InferModel<typeof movieTable>;
export type PickMovie = Pick<Movie, "title"> & {
  view_date: string;
  diff: string;
};
export type PickApiMovie = Pick<Movie, "title"> & {
  view_date: string;
};
export type NewMovie = InferModel<typeof movieTable, "insert">;

export type Theater = InferModel<typeof theaterTable>;
export type NewTheater = InferModel<typeof theaterTable, "insert">;

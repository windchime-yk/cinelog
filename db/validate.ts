import { createInsertSchema } from "drizzle-zod";
import { movieTable, theaterTable } from "~/db/schema.ts";
import type { NewMovie, NewTheater } from "~/db/model.ts";

export const validateInsertMovieSchema = (movie: NewMovie) => {
  return createInsertSchema(movieTable).safeParse(movie);
};

export const validateInserttheaterSchema = (theater: NewTheater) => {
  return createInsertSchema(theaterTable).safeParse(theater);
};

// @deno-types="https://esm.sh/v130/drizzle-orm@0.27.2/index.d.ts"
import { type InferModel } from "drizzle-orm";
// @deno-types="https://esm.sh/v130/drizzle-orm@0.27.2/mysql-core/index.d.ts"
import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
// @deno-types="https://esm.sh/v130/drizzle-zod@0.4.4/index.d.ts"
import { createInsertSchema } from "drizzle-zod";

export const theaterTable = mysqlTable("tbl_theater", {
  /** ID */
  id: serial("id").autoincrement().primaryKey().unique(),
  /** 上映館 */
  name: varchar("name", { length: 246 }).notNull().unique(),
});

export type Theater = InferModel<typeof theaterTable>;
export type NewTheater = InferModel<typeof theaterTable, "insert">;

export const validateInserttheaterSchema = (theater: NewTheater) => {
  return createInsertSchema(theaterTable).safeParse(theater);
};

import { type InferModel } from "drizzle-orm";
import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
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

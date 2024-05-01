import { desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { createConnection } from "mysql2";
import { movieTable } from "~/db/schema.ts";
import type { PickMovie } from "~/db/model.ts";

const connection = createConnection({
  host: Deno.env.get("DB_HOST"),
  user: Deno.env.get("DEVELOP")
    ? Deno.env.get("DB_DEV_USERNAME")
    : Deno.env.get("DB_USERNAME"),
  password: Deno.env.get("DEVELOP")
    ? Deno.env.get("DB_DEV_PASSWORD")
    : Deno.env.get("DB_PASSWORD"),
  database: "cinelog",
  /**
   * NOTE: mysql2内の`node:tls`のデフォルトCAを使うための設定
   * @see https://zenn.dev/link/comments/378474ec5af4e7
   */
  ssl: {},
});

export const db = drizzle(connection);

/**
 * Cardコンポーネントの表示に必要なデータをDBから取得
 * @param limit 取得件数
 */
export const getCardData = async (
  limit?: number,
): Promise<Array<PickMovie>> => {
  let movies: Array<PickMovie>;
  try {
    if (!limit) {
      movies = await db.select({
        title: movieTable.title,
        view_date: sql<
          string
        >`DATE_FORMAT(DATE(${movieTable.view_start_datetime}), '%Y/%m/%d')`,
        diff: sql<
          number
        >`TIMESTAMPDIFF(MINUTE, ${movieTable.view_start_datetime}, ${movieTable.view_end_datetime})`,
      }).from(movieTable).orderBy(desc(movieTable.view_start_datetime));
    } else {
      movies = await db.select({
        title: movieTable.title,
        view_date: sql<
          string
        >`DATE_FORMAT(DATE(${movieTable.view_start_datetime}), '%Y/%m/%d')`,
        diff: sql<
          number
        >`TIMESTAMPDIFF(MINUTE, ${movieTable.view_start_datetime}, ${movieTable.view_end_datetime})`,
      }).from(movieTable).limit(limit).orderBy(
        desc(movieTable.view_start_datetime),
      );
    }
  } catch (error) {
    movies = [];
    console.log(error);
  }

  return movies;
};

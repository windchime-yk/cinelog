import { desc, sql } from "drizzle-orm";
import { drizzle  } from "drizzle-orm/planetscale-serverless";
import { connect } from "planetscale";
import { movieTable } from "~/db/schema.ts";
import type { PickMovie } from "~/db/model.ts";
import "$std/dotenv/load.ts";

const connection = connect({
  host: Deno.env.get("PS_HOST"),
  username: Deno.env.get("DEVELOP")
    ? Deno.env.get("PS_DEV_USERNAME")
    : Deno.env.get("PS_USERNAME"),
  password: Deno.env.get("DEVELOP")
    ? Deno.env.get("PS_DEV_PASSWORD")
    : Deno.env.get("PS_PASSWORD"),
});

export const db = drizzle(connection);

/**
 * Cardコンポーネントの表示に必要なデータをDBから取得
 * @param limit 取得件数
 */
export const getCardData = async (limit?: number): Promise<Array<PickMovie>> => {
  let movies: Array<PickMovie>
  try {
    if (!limit) {
      movies = await db.select({
        title: movieTable.title,
        view_date: sql<
          string
        >`DATE_FORMAT(DATE(${movieTable.view_start_datetime}), '%Y/%m/%d')`,
        diff: sql<
          string
        >`TIMESTAMPDIFF(MINUTE, ${movieTable.view_start_datetime}, ${movieTable.view_end_datetime})`,
      }).from(movieTable).orderBy(desc(movieTable.view_start_datetime));
    } else {
      movies = await db.select({
        title: movieTable.title,
        view_date: sql<
          string
        >`DATE_FORMAT(DATE(${movieTable.view_start_datetime}), '%Y/%m/%d')`,
        diff: sql<
          string
        >`TIMESTAMPDIFF(MINUTE, ${movieTable.view_start_datetime}, ${movieTable.view_end_datetime})`,
      }).from(movieTable).limit(limit).orderBy(desc(movieTable.view_start_datetime));
    }
  } catch (_error) {
    movies = []
  }

  return movies
}

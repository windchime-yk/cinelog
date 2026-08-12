import { desc, eq, like, max, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/tidb-serverless";
import { connect } from "@tidbcloud/serverless";
import {
  companionTypeTable,
  formatTable,
  movieTable,
  theaterTable,
} from "~/db/schema.ts";
import type { MasterRecord, PickApiMovie, PickMovie } from "~/db/model.ts";

const username = Deno.env.get("DEVELOP")
  ? Deno.env.get("DB_DEV_USERNAME")
  : Deno.env.get("DB_USERNAME");
const password = Deno.env.get("DEVELOP")
  ? Deno.env.get("DB_DEV_PASSWORD")
  : Deno.env.get("DB_PASSWORD");

const connection = connect({
  host: Deno.env.get("DB_HOST"),
  username,
  password,
  database: "cinelog",
});

export const db = drizzle(connection);

/**
 * Cardコンポーネントの表示に必要な列を選択するクエリを組み立てる。
 *
 * 一覧・TOP・検索で同じ形を使うため共通化してある。呼び出し側で
 * where / orderBy / limit を足す
 */
const selectCardData = () =>
  db.select({
    title: movieTable.title,
    view_date: sql<
      string
    >`DATE_FORMAT(DATE(${movieTable.view_start_datetime}), '%Y/%m/%d')`,
    diff: sql<
      number
    >`TIMESTAMPDIFF(MINUTE, ${movieTable.view_start_datetime}, ${movieTable.view_end_datetime})`,
    is_subtitled: movieTable.is_subtitled,
    is_domestic: movieTable.is_domestic,
    format: formatTable.name,
  })
    .from(movieTable)
    .leftJoin(formatTable, eq(movieTable.format_id, formatTable.id));

/**
 * Cardコンポーネントの表示に必要なデータをDBから取得
 * @param limit 取得件数
 */
export const getCardData = async (
  limit?: number,
): Promise<Array<PickMovie>> => {
  try {
    const query = selectCardData().orderBy(
      desc(movieTable.view_start_datetime),
    );
    return await (limit ? query.limit(limit) : query);
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * タイトルの部分一致でCardコンポーネントの表示に必要なデータをDBから取得
 * @param search 検索文字列
 */
export const searchCardData = async (
  search: string | null,
): Promise<Array<PickMovie>> => {
  try {
    return await selectCardData()
      .where(like(movieTable.title, `%${search}%`))
      .orderBy(desc(movieTable.view_start_datetime));
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * ダッシュボードのセレクトボックス用マスタデータをDBから取得
 */
export const getMasterData = async (): Promise<{
  theaters: Array<MasterRecord>;
  formats: Array<MasterRecord>;
  companionTypes: Array<MasterRecord>;
}> => {
  try {
    const [theaters, formats, companionTypes] = await Promise.all([
      db.select({ id: theaterTable.id, name: theaterTable.name }).from(
        theaterTable,
      ),
      db.select({ id: formatTable.id, name: formatTable.name }).from(
        formatTable,
      ),
      db.select({
        id: companionTypeTable.id,
        name: companionTypeTable.name,
      }).from(companionTypeTable),
    ]);

    return { theaters, formats, companionTypes };
  } catch (error) {
    console.log(error);
    return { theaters: [], formats: [], companionTypes: [] };
  }
};

/**
 * 公開APIの作品一覧表示に必要なデータをDBから取得
 * @param distinct タイトルで重複排除するか
 */
export const getApiMovies = (
  distinct: boolean,
): Promise<Array<PickApiMovie>> => {
  if (distinct) {
    return db.select({
      title: movieTable.title,
      view_date: sql<
        string
      >`DATE_FORMAT(DATE(MAX(${movieTable.view_start_datetime})), '%Y/%m/%d')`,
    }).from(movieTable).groupBy(movieTable.title).orderBy(
      desc(max(movieTable.view_start_datetime)),
    );
  }

  return db.select({
    title: movieTable.title,
    view_date: sql<
      string
    >`DATE_FORMAT(DATE(${movieTable.view_start_datetime}), '%Y/%m/%d')`,
  }).from(movieTable).orderBy(desc(movieTable.view_start_datetime));
};

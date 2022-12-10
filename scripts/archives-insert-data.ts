import { isExistFile, writeFile } from "../deps.ts";
import { CombineSql, Conn } from "../core.ts";
import { MovieInfo } from "../model.ts";

const SQL_FILE_NAME = "sql/insert_data.sql";

if (await isExistFile(SQL_FILE_NAME)) await Deno.truncate(SQL_FILE_NAME);

// PlanetScaleからデータ取得
const outputPlanetScaleData = (table: string): Promise<MovieInfo[]> => {
  const sql = new CombineSql();
  const selectSql = sql.generateSelectSql({ table });
  const conn = new Conn();
  return conn.execute<MovieInfo>(selectSql);
};

const movieinfoData = await outputPlanetScaleData("tbl_movieinfo");
const movieinfoDataMap = movieinfoData.map((data: Partial<MovieInfo>) => {
  delete data.id;
  return data;
});

// SQLで全文取得してINSERT INTO文に整形して.sqlにして保存
const writeInsertSqlFile = async (
  table: string,
  inserts: Partial<MovieInfo>[],
) => {
  const insertSql = new CombineSql().generateInsertSql({ table, inserts });
  await writeFile(`${insertSql};`, SQL_FILE_NAME);
  console.log(`create insert data: ${table}`);
};

await writeInsertSqlFile("tbl_movieinfo", movieinfoDataMap);

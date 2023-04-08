import { isExistFile, writeFile } from "util/file.ts";
import { Conn } from "../core/conn.ts";
import { CombineSql } from "../core/sql.ts";
import type { MovieInfo, Table, TheaterInfo } from "../model.ts";

// PlanetScaleからデータ取得
const outputPlanetScaleData = <T>(table: Table): Promise<T[]> => {
  const sql = new CombineSql();
  const selectSql = sql.generateSelectSql({ table });
  const conn = new Conn();
  return conn.execute<T>(selectSql);
};

const movieinfoData = await outputPlanetScaleData<MovieInfo>("tbl_movieinfo");
const movieinfoDataMap = movieinfoData.map((data: Partial<MovieInfo>) => {
  delete data.id;
  return data;
});
const theaterinfoData = await outputPlanetScaleData<TheaterInfo>("tbl_theater");

const getSqlFileName = (table: Table) => `sql/insert_data_${table}.sql`;

// SQLで全文取得してINSERT INTO文に整形して.sqlにして保存
const writeInsertSqlFile = async <T>(
  table: Table,
  inserts: Partial<T>[],
) => {
  if (await isExistFile(getSqlFileName(table))) {
    await Deno.truncate(getSqlFileName(table));
  }
  console.debug({ inserts });
  const insertSql = new CombineSql<T>().generateInsertSql({ table, inserts });
  await writeFile(`${insertSql};`, getSqlFileName(table));
  console.log(`create insert data: ${table}`);
};

await writeInsertSqlFile<MovieInfo>("tbl_movieinfo", movieinfoDataMap);
await writeInsertSqlFile<TheaterInfo>("tbl_theater", theaterinfoData);

import { Conn } from "./conn.ts";
import { CombineSql } from "./sql.ts";
import type { CombineSqlOptions, MovieInfo, TheaterInfo } from "../model.ts";

/**
 * 鑑賞作品データの配列を返却する
 */
export const fetchMovieInfo = async (
  options: CombineSqlOptions<MovieInfo>
): Promise<MovieInfo[]> => {
  const conn = new Conn();
  const sql = new CombineSql<MovieInfo>();

  try {
    const result = await conn.execute<MovieInfo>(
      sql.generateSelectSql({
        table: options.table,
        fields: options.fields,
        where: options.where,
        like: options.like,
        order: {
          target: options.order?.target ?? "view_date",
          sort: options.order?.sort ?? "desc",
        },
        limit: options.limit,
      })
    );

    return result;
  } catch (error) {
    return [];
  }
};

/**
 * 鑑賞作品データを追加する
 */
export const addMovieInfo = (
  options: CombineSqlOptions<MovieInfo>,
): Promise<MovieInfo[]> => {
  const conn = new Conn();
  const sql = new CombineSql<MovieInfo>();

  return conn.execute<MovieInfo>(sql.generateInsertSql({
    table: options.table,
    inserts: options.inserts,
  }));
};

export const fetchTheaterInfo = async (
  options: CombineSqlOptions<TheaterInfo>
): Promise<TheaterInfo[]> => {
  const conn = new Conn();
  const sql = new CombineSql<TheaterInfo>();

  try {
    const result = await conn.execute<TheaterInfo>(
      sql.generateSelectSql({
        table: options.table,
        fields: options.fields,
      })
    );

    return result;
  } catch (error) {
    return [];
  }
};

export const addTheaterInfo = (
  options: CombineSqlOptions<TheaterInfo>,
): Promise<TheaterInfo[]> => {
  const conn = new Conn();
  const sql = new CombineSql<TheaterInfo>();

  return conn.execute<TheaterInfo>(sql.generateInsertSql({
    table: options.table,
    inserts: options.inserts,
  }));
};

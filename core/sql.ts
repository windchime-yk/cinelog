import { Convert } from "./convert.ts";
import type { CombineSqlOptions } from "../model.ts";

/** SQL文の断片を1つにまとめて文字列として生成する */
export class CombineSql<T> {
  private convert: Convert;

  constructor() {
    this.convert = new Convert();
  }

  /**
   * フィールドを指定するSQL断片を生成
   * @param fields フィールド名
   */
  private getFields(fields: CombineSqlOptions<T>["fields"]): string {
    if (!fields) return "*";
    return fields.join(",");
  }

  /**
   * テーブルを指定するSQL断片を生成
   * @param table テーブル名
   */
  private getTable(table: CombineSqlOptions<T>["table"]) {
    return `FROM ${table}`;
  }

  /**
   * 検索条件を指定するSQL断片を生成
   * @param where 検索条件
   * @param like 曖昧検索条件
   */
  private getWhere(
    where: CombineSqlOptions<T>["where"],
    like: CombineSqlOptions<T>["like"],
  ): string {
    if (!where) return "";
    if (like) return `WHERE ${where} LIKE '%${like}%'`;
    return `WHERE ${where}`;
  }

  /**
   * 並び替え順を指定するSQL断片を生成
   * @param order 並び替え順
   */
  private getOrder(order: CombineSqlOptions<T>["order"]): string {
    if (!order) return "";
    return `ORDER BY ${String(order.target)} ${order.sort}`;
  }

  /**
   * 出力データ数を指定するSQL断片を生成
   * @param limit 出力データ数
   */
  private getLimit(limit: CombineSqlOptions<T>["limit"]): string {
    if (!limit) return "";
    return `LIMIT ${limit}`;
  }

  /**
   * 追加データを指定するSQL断片を生成
   * @param inserts 追加データ
   */
  private getInserts(inserts: CombineSqlOptions<T>["inserts"]): string {
    if (!inserts) return "";

    if (Array.isArray(inserts)) {
      const keys = new Set();
      for (let i = 0; i < inserts.length; i++) {
        const insert = inserts[i];
        for (const value of Object.keys(insert)) {
          keys.add(value);
        }
      }
      const values = inserts.map((insert) => {
        return `(${
          Object.values(insert).map((value) =>
            // TODO: 型アサーションを取り除きたい
            this.convert.insertSingleQuote(
              this.convert.nullish(value as string | number | boolean | null),
            )
          )
        })`;
      });

      return `(${[...keys]}) VALUES ${values}`;
    }

    const keys = Object.keys(inserts).join(",");
    const values = Object.values(inserts).map((value) => {
      // TODO: 型アサーションを取り除きたい
      return this.convert.insertSingleQuote(
        value as string | number | boolean | null,
      );
    }).join(",");

    return `(${keys}) VALUES (${values})`;
  }

  /**
   * SQL断片を1つのSQL文に結合する
   * @param sql SQL文の断片の配列
   */
  private joinSqlFragment(sql: string[]): string {
    return sql.join(" ").trim().replace(/ {2,}/g, " ");
  }

  /**
   * SELECT文の生成
   * @param options テーブル名やフィールド名などの条件
   */
  public generateSelectSql(options: CombineSqlOptions<T>): string {
    const sql = [
      this.getFields(options.fields),
      this.getTable(options.table),
      this.getWhere(options.where, options.like),
      this.getOrder(options.order),
      this.getLimit(options.limit),
    ];

    return `SELECT ${this.joinSqlFragment(sql)}`;
  }

  /**
   * INSERT INTO文の生成
   * @param options テーブル名やフィールド名などの条件
   */
  public generateInsertSql(options: CombineSqlOptions<T>): string {
    if (!options.inserts) return "";
    return `INSERT INTO ${options.table}${this.getInserts(options.inserts)}`;
  }
}

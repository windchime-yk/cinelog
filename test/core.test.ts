import { assertEquals } from "../deps.ts";
import { CombineSql } from "../core.ts";

Deno.test("SQL断片統合Class宣言テスト", async (t) => {
  const TABLE = "tbl_test";
  const sql = new CombineSql();
  await t.step("SELECT文", async (t) => {
    await t.step("SELECTのみ", () => {
      assertEquals<string>(
        sql.generateSelectSql({ table: TABLE }),
        `SELECT * FROM ${TABLE}`,
      );
    });
    await t.step("fieldsあり", () => {
      assertEquals<string>(
        sql.generateSelectSql({ table: TABLE, fields: ["title", "rating"] }),
        `SELECT title,rating FROM ${TABLE}`,
      );
    });
    await t.step("fields、where", () => {
      assertEquals<string>(
        sql.generateSelectSql({
          table: TABLE,
          fields: ["title", "rating"],
          where: "rating = 5",
        }),
        `SELECT title,rating FROM ${TABLE} WHERE rating = 5`,
      );
    });
    await t.step("fields、where、like", () => {
      assertEquals<string>(
        sql.generateSelectSql({
          table: TABLE,
          fields: ["title", "rating"],
          where: "title",
          like: "ブラック",
        }),
        `SELECT title,rating FROM ${TABLE} WHERE title LIKE '%ブラック%'`,
      );
    });
    await t.step("fields、order", () => {
      assertEquals<string>(
        sql.generateSelectSql({
          table: TABLE,
          fields: ["title", "rating"],
          order: {
            target: "view_date",
            sort: "desc",
          },
        }),
        `SELECT title,rating FROM ${TABLE} ORDER BY view_date desc`,
      );
    });
    await t.step("fields、limit", () => {
      assertEquals<string>(
        sql.generateSelectSql({
          table: TABLE,
          fields: ["title", "rating"],
          limit: 10,
        }),
        `SELECT title,rating FROM ${TABLE} LIMIT 10`,
      );
    });
    await t.step("全部入り", () => {
      assertEquals<string>(
        sql.generateSelectSql({
          table: TABLE,
          fields: ["title", "rating"],
          where: "title",
          like: "ブラック",
          order: {
            target: "view_date",
            sort: "desc",
          },
          limit: 10,
        }),
        `SELECT title,rating FROM ${TABLE} WHERE title LIKE '%ブラック%' ORDER BY view_date desc LIMIT 10`,
      );
    });
  });
});

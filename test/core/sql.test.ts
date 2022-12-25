import { assertEquals } from "../../deps.ts";
import { CombineSql } from "../../core/sql.ts";
import { MovieInfo } from "../../model.ts";

Deno.test("SQL断片統合Class宣言テスト", async (t) => {
  const TABLE = "tbl_movieinfo";
  const sql = new CombineSql<MovieInfo>();

  await t.step("SELECT文", async (t) => {
    await t.step("SELECTのみ", () => {
      assertEquals<string>(
        sql.generateSelectSql({ table: TABLE }),
        `SELECT * FROM ${TABLE}`
      );
    });
    await t.step("fieldsあり", () => {
      assertEquals<string>(
        sql.generateSelectSql({ table: TABLE, fields: ["title", "rating"] }),
        `SELECT title,rating FROM ${TABLE}`
      );
    });
    await t.step("fields、where", () => {
      assertEquals<string>(
        sql.generateSelectSql({
          table: TABLE,
          fields: ["title", "rating"],
          where: "rating = 5",
        }),
        `SELECT title,rating FROM ${TABLE} WHERE rating = 5`
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
        `SELECT title,rating FROM ${TABLE} WHERE title LIKE '%ブラック%'`
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
        `SELECT title,rating FROM ${TABLE} ORDER BY view_date desc`
      );
    });
    await t.step("fields、limit", () => {
      assertEquals<string>(
        sql.generateSelectSql({
          table: TABLE,
          fields: ["title", "rating"],
          limit: 10,
        }),
        `SELECT title,rating FROM ${TABLE} LIMIT 10`
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
        `SELECT title,rating FROM ${TABLE} WHERE title LIKE '%ブラック%' ORDER BY view_date desc LIMIT 10`
      );
    });
  });

  await t.step("INSERT INTO文", async (t) => {
    await t.step("単体更新", () => {
      assertEquals<string>(
        sql.generateInsertSql({
          table: TABLE,
          inserts: { title: "title", comment: "comment" },
        }),
        `INSERT INTO ${TABLE}(title,comment) VALUES ('title','comment')`
      );
    });
    await t.step("単体更新（数値あり）", () => {
      assertEquals<string>(
        sql.generateInsertSql({
          table: TABLE,
          inserts: { title: "title", rating: 1, comment: "comment" },
        }),
        `INSERT INTO ${TABLE}(title,rating,comment) VALUES ('title',1,'comment')`
      );
    });
    await t.step("単体更新（真偽値あり）", () => {
      assertEquals<string>(
        sql.generateInsertSql({
          table: TABLE,
          inserts: { title: "title", is_dubbed: true, comment: "comment" },
        }),
        `INSERT INTO ${TABLE}(title,is_dubbed,comment) VALUES ('title',true,'comment')`
      );
    });
    await t.step("単体更新（nullあり）", () => {
      assertEquals<string>(
        sql.generateInsertSql({
          table: TABLE,
          inserts: { title: "title", is_dubbed: null, comment: "comment" },
        }),
        `INSERT INTO ${TABLE}(title,is_dubbed,comment) VALUES ('title',null,'comment')`
      );
    });
    await t.step("単体更新（日付あり）", () => {
      assertEquals<string>(
        sql.generateInsertSql({
          table: TABLE,
          inserts: {
            title: "title",
            view_date: "2022/04/19",
            comment: "comment",
          },
        }),
        `INSERT INTO ${TABLE}(title,view_date,comment) VALUES ('title','2022/04/19','comment')`
      );
    });
    await t.step("単体更新（日付ゼロ詰め）", () => {
      assertEquals<string>(
        sql.generateInsertSql({
          table: TABLE,
          inserts: {
            title: "title",
            view_date: Intl.DateTimeFormat("ja-JP", {
              dateStyle: "medium",
            }).format(new Date("2022/4/19")),
            comment: "comment",
          },
        }),
        `INSERT INTO ${TABLE}(title,view_date,comment) VALUES ('title','2022/04/19','comment')`
      );
    });
    await t.step("複数更新", () => {
      assertEquals<string>(
        sql.generateInsertSql({
          table: TABLE,
          inserts: [
            {
              title: "title",
              view_date: "2022/04/19",
              comment: "",
            },
            {
              title: "title2",
              view_date: "2022/04/20",
              comment: "comment2",
            },
          ],
        }),
        `INSERT INTO ${TABLE}(title,view_date,comment) VALUES ('title','2022/04/19',null),('title2','2022/04/20','comment2')`
      );
    });
  });
});

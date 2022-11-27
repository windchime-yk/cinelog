import { assertEquals } from "../deps.ts";
import { CombineSql, Convert } from "../core.ts";

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

  await t.step("INSERT INTO文", async (t) => {
    await t.step("単体更新", () => {
      assertEquals<string>(
        sql.generateInsertSql({
          table: TABLE,
          inserts: { title: "title", comment: "comment" },
        }),
        `INSERT INTO ${TABLE}(title,comment) VALUES ('title','comment')`,
      );
    });
    await t.step("単体更新（数値あり）", () => {
      assertEquals<string>(
        sql.generateInsertSql({
          table: TABLE,
          inserts: { title: "title", rating: 1, comment: "comment" },
        }),
        `INSERT INTO ${TABLE}(title,rating,comment) VALUES ('title',1,'comment')`,
      );
    });
    await t.step("単体更新（真偽値あり）", () => {
      assertEquals<string>(
        sql.generateInsertSql({
          table: TABLE,
          inserts: { title: "title", is_dubbed: true, comment: "comment" },
        }),
        `INSERT INTO ${TABLE}(title,is_dubbed,comment) VALUES ('title',true,'comment')`,
      );
    });
    await t.step("単体更新（nullあり）", () => {
      assertEquals<string>(
        sql.generateInsertSql({
          table: TABLE,
          inserts: { title: "title", is_dubbed: null, comment: "comment" },
        }),
        `INSERT INTO ${TABLE}(title,is_dubbed,comment) VALUES ('title',null,'comment')`,
      );
    });
  });
});

Deno.test("文字列変換Class宣言テスト", async (t) => {
  const convert = new Convert();

  await t.step("シングルクォート挿入", async (t) => {
    await t.step("文字列", () => {
      assertEquals<string>(convert.insertSingleQuote("あいうえお"), "'あいうえお'");
    });
    await t.step("数値", () => {
      assertEquals<string>(convert.insertSingleQuote(1), "1");
    });
    await t.step("文字列の数値", () => {
      assertEquals<string>(convert.insertSingleQuote("1"), "1");
    });
    await t.step("真偽値のtrue", () => {
      assertEquals<string>(convert.insertSingleQuote(true), "true");
    });
    await t.step("真偽値のfalse", () => {
      assertEquals<string>(convert.insertSingleQuote(false), "false");
    });
    await t.step("文字列のtrue", () => {
      assertEquals<string>(convert.insertSingleQuote("true"), "true");
    });
    await t.step("文字列のfalse", () => {
      assertEquals<string>(convert.insertSingleQuote("false"), "false");
    });
    await t.step("文字列のnull", () => {
      assertEquals<string>(convert.insertSingleQuote("null"), "null");
    });
    await t.step("null", () => {
      assertEquals<string>(convert.insertSingleQuote(null), "null");
    });
  });

  await t.step("フォームから渡される特定の文字列をbooleanに変換", async (t) => {
    await t.step("onをbooleanに変換", () => {
      assertEquals<boolean>(convert.isFormToDatabase("on"), true);
    });
    await t.step("offをbooleanに変換", () => {
      assertEquals<boolean>(convert.isFormToDatabase("off"), false);
    });
    await t.step("nullをbooleanに変換", () => {
      assertEquals<boolean>(convert.isFormToDatabase("null"), false);
    });
  });

  await t.step("nullに変換", async (t) => {
    await t.step("空文字列をnullに変換", () => {
      assertEquals<string | null>(convert.nullish(""), null);
    });
    await t.step("nullをそのまま出力", () => {
      assertEquals<string | null>(convert.nullish(null), null);
    });
    await t.step("文字列をそのまま出力", () => {
      assertEquals<string | null>(convert.nullish("テスト"), "テスト");
    });
  });
});

import { assertEquals } from "../../deps.ts";
import { Convert } from "../../core/convert.ts";

Deno.test("文字列変換Class宣言テスト", async (t) => {
  const convert = new Convert();

  await t.step("シングルクォート挿入", async (t) => {
    await t.step("文字列", () => {
      assertEquals<string>(
        convert.insertSingleQuote("あいうえお"),
        "'あいうえお'",
      );
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
      assertEquals<string | number | boolean | null>(convert.nullish(""), null);
    });
    await t.step("nullをそのまま出力", () => {
      assertEquals<string | number | boolean | null>(
        convert.nullish(null),
        null,
      );
    });
    await t.step("文字列をそのまま出力", () => {
      assertEquals<string | number | boolean | null>(
        convert.nullish("テスト"),
        "テスト",
      );
    });
    await t.step("数字をそのまま出力", () => {
      assertEquals<string | number | boolean | null>(convert.nullish(1), 1);
    });
    await t.step("真偽値をそのまま出力", () => {
      assertEquals<string | number | boolean | null>(
        convert.nullish(true),
        true,
      );
    });
  });
});

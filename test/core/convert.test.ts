import { assertEquals } from "$std/testing/asserts.ts";
import { Convert } from "~/core/convert.ts";

Deno.test("文字列変換Class宣言テスト", async (t) => {
  const convert = new Convert();

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
});

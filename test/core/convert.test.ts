import { assertEquals, assertThrows } from "$std/testing/asserts.ts";
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

  await t.step("日時をそれぞれ入力して結合", async (t) => {
    await t.step("午前", () => {
      assertEquals<string>(
        convert.formatDatetime("2023-09-11", "03:00"),
        "2023/09/11 3:00:00",
      );
    });
    await t.step("午後", () => {
      assertEquals<string>(
        convert.formatDatetime("2023-09-11", "15:00"),
        "2023/09/11 15:00:00",
      );
    });
    await t.step("日付なし", () => {
      assertThrows(() => convert.formatDatetime("", "15:00"), RangeError);
    });
    await t.step("時間なし", () => {
      assertEquals<string>(
        convert.formatDatetime("2023-09-11", ""),
        "2023/09/11 0:00:00",
      );
    });
    await t.step("日付null", () => {
      assertThrows(() => convert.formatDatetime(null, "15:00"), RangeError);
    });
    await t.step("時間null", () => {
      assertThrows(
        () => convert.formatDatetime("2023-09-11", null),
        RangeError,
      );
    });
  });
});

import { assertEquals, assertThrows } from "@std/assert";
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
    await t.step("午前はゼロ埋めされる", () => {
      assertEquals<string>(
        convert.formatDatetime("2023-09-11", "03:00"),
        "2023-09-11 03:00:00",
      );
    });
    await t.step("午後", () => {
      assertEquals<string>(
        convert.formatDatetime("2023-09-11", "15:00"),
        "2023-09-11 15:00:00",
      );
    });
    await t.step("秒まで指定した場合はそのまま保持", () => {
      assertEquals<string>(
        convert.formatDatetime("2023-09-11", "15:00:30"),
        "2023-09-11 15:00:30",
      );
    });
    await t.step("日付なし", () => {
      assertThrows(() => convert.formatDatetime("", "15:00"), RangeError);
    });
    await t.step("日付null", () => {
      assertThrows(() => convert.formatDatetime(null, "15:00"), RangeError);
    });
    await t.step("スラッシュ区切りの日付", () => {
      assertThrows(
        () => convert.formatDatetime("2023/09/11", "15:00"),
        RangeError,
      );
    });
    await t.step("存在しない日付", () => {
      assertThrows(
        () => convert.formatDatetime("2023-02-30", "15:00"),
        RangeError,
      );
    });
    await t.step("存在しない月", () => {
      assertThrows(
        () => convert.formatDatetime("2023-13-01", "15:00"),
        RangeError,
      );
    });
    await t.step("時間なし", () => {
      assertThrows(() => convert.formatDatetime("2023-09-11", ""), RangeError);
    });
    await t.step("時間null", () => {
      assertThrows(
        () => convert.formatDatetime("2023-09-11", null),
        RangeError,
      );
    });
    await t.step("存在しない時刻", () => {
      assertThrows(
        () => convert.formatDatetime("2023-09-11", "25:00"),
        RangeError,
      );
    });
    await t.step("ゼロ埋めされていない時刻", () => {
      assertThrows(
        () => convert.formatDatetime("2023-09-11", "3:00"),
        RangeError,
      );
    });
  });

  await t.step("日付に日数を加算", async (t) => {
    await t.step("翌日", () => {
      assertEquals<string>(convert.addDays("2023-09-11", 1), "2023-09-12");
    });
    await t.step("月を跨ぐ", () => {
      assertEquals<string>(convert.addDays("2023-09-30", 1), "2023-10-01");
    });
    await t.step("年を跨ぐ", () => {
      assertEquals<string>(convert.addDays("2023-12-31", 1), "2024-01-01");
    });
    await t.step("閏年の2月", () => {
      assertEquals<string>(convert.addDays("2024-02-28", 1), "2024-02-29");
    });
    await t.step("閏年ではない年の2月", () => {
      assertEquals<string>(convert.addDays("2023-02-28", 1), "2023-03-01");
    });
    await t.step("加算しない", () => {
      assertEquals<string>(convert.addDays("2023-09-11", 0), "2023-09-11");
    });
    await t.step("不正な日付", () => {
      assertThrows(() => convert.addDays("2023/09/11", 1), RangeError);
    });
  });

  await t.step("日を跨いだ鑑賞かどうかを判定", async (t) => {
    await t.step("同日の鑑賞", () => {
      assertEquals<boolean>(convert.isCrossDay("19:00", "21:30"), false);
    });
    await t.step("日を跨ぐ鑑賞", () => {
      assertEquals<boolean>(convert.isCrossDay("23:30", "01:45"), true);
    });
    await t.step("開始と終了が同時刻なら日を跨がない", () => {
      assertEquals<boolean>(convert.isCrossDay("21:00", "21:00"), false);
    });
    await t.step("秒の有無が異なる同時刻", () => {
      assertEquals<boolean>(convert.isCrossDay("21:00", "21:00:00"), false);
    });
    await t.step("時刻不明レコードの00:00→00:00", () => {
      assertEquals<boolean>(convert.isCrossDay("00:00", "00:00"), false);
    });
    await t.step("0時開始で日を跨がない", () => {
      assertEquals<boolean>(convert.isCrossDay("00:00", "23:59"), false);
    });
    await t.step("不正な時間", () => {
      assertThrows(() => convert.isCrossDay("19:00", "25:00"), RangeError);
    });
  });
});

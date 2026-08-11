import { assertEquals } from "@std/assert";
import { getDashboardErrorMessage } from "~/core/message.ts";

Deno.test("ダッシュボードのエラーメッセージ取得テスト", async (t) => {
  await t.step("既知のエラーコード", async (t) => {
    await t.step("cross-day-mismatch", () => {
      assertEquals<string | null>(
        getDashboardErrorMessage("cross-day-mismatch"),
        "「日を跨ぐ」のチェックと上映終了時間が一致していません。入力内容を確認してください",
      );
    });
    await t.step("invalid-rating", () => {
      assertEquals<string | null>(
        getDashboardErrorMessage("invalid-rating"),
        "評価は1〜5の整数で入力してください",
      );
    });
    await t.step("duplicate-name", () => {
      assertEquals<string | null>(
        getDashboardErrorMessage("duplicate-name"),
        "同じ名称がすでに登録されています",
      );
    });
  });

  await t.step("未知のエラーコードはnull", async (t) => {
    await t.step("登録されていない文字列", () => {
      assertEquals<string | null>(getDashboardErrorMessage("unknown"), null);
    });
    await t.step("任意の文言を渡されても表示しない", () => {
      assertEquals<string | null>(
        getDashboardErrorMessage("パスワードを再入力してください"),
        null,
      );
    });
    await t.step("null", () => {
      assertEquals<string | null>(getDashboardErrorMessage(null), null);
    });
    await t.step("空文字", () => {
      assertEquals<string | null>(getDashboardErrorMessage(""), null);
    });
  });
});

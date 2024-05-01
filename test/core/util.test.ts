import { assertEquals } from "$std/testing/asserts.ts";
import { elapsedTime, isInvalidAccount } from "~/core/util.ts";

Deno.test(
  { name: "アカウントが不正かどうか", permissions: { env: true } },
  async (t) => {
    const VALID_USERNAME = "test01";
    const VALID_PASSWORD = "testtest";
    const INVALID_WORD = "test";
    Deno.env.set("USERNAME", VALID_USERNAME);
    Deno.env.set("PASSWORD", VALID_PASSWORD);

    try {
      await t.step("不正", () => {
        assertEquals<boolean>(
          isInvalidAccount(INVALID_WORD, INVALID_WORD),
          true,
        );
      });
      await t.step("USERNAME: 不正なし、PASSWORD: 不正", () => {
        assertEquals<boolean>(
          isInvalidAccount(VALID_USERNAME, INVALID_WORD),
          true,
        );
      });
      await t.step("USERNAME: 不正、PASSWORD: 不正なし", () => {
        assertEquals<boolean>(
          isInvalidAccount(INVALID_WORD, VALID_PASSWORD),
          true,
        );
      });
      await t.step("不正なし", () => {
        assertEquals<boolean>(
          isInvalidAccount(VALID_USERNAME, VALID_PASSWORD),
          // NOTE: 動作としてはfalseが正しいが、ローカル環境だと.envファイルが優先されてエラーになる
          false,
        );
      });
    } finally {
      Deno.env.delete("USERNAME");
      Deno.env.delete("PASSWORD");
    }
  },
);

Deno.test({ name: "経過時間の表記" }, async (t) => {
  await t.step("経過時間が0", () => {
    assertEquals<string>(elapsedTime(0), "不明");
  });
  await t.step("経過時間が0以外", () => {
    assertEquals<string>(elapsedTime(180), "180分");
  });
});

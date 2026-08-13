import { assertEquals, assertStringIncludes } from "@std/assert";
import {
  clearLegacyCookies,
  createSessionToken,
  isLoggedIn,
  isValidSessionToken,
  setSessionCookie,
} from "~/core/session.ts";

const USERNAME = "test01";
const PASSWORD = "testtest";

/** 環境変数を設定した状態でテスト本体を動かす */
const withAccount = async (fn: () => void | Promise<void>): Promise<void> => {
  Deno.env.set("USERNAME", USERNAME);
  Deno.env.set("PASSWORD", PASSWORD);

  try {
    await fn();
  } finally {
    Deno.env.delete("USERNAME");
    Deno.env.delete("PASSWORD");
  }
};

Deno.test(
  { name: "セッショントークンの検証", permissions: { env: true } },
  async (t) => {
    await t.step("発行直後のトークンは有効", async () => {
      await withAccount(() => {
        assertEquals<boolean>(isValidSessionToken(createSessionToken()), true);
      });
    });

    await t.step("有効期限を過ぎたトークンは無効", async () => {
      await withAccount(() => {
        const token = createSessionToken();
        // 有効期間（7日）より先の時刻で検証する
        const future = Date.now() + 1000 * 60 * 60 * 24 * 8;
        assertEquals<boolean>(isValidSessionToken(token, future), false);
      });
    });

    await t.step("署名を改竄したトークンは無効", async () => {
      await withAccount(() => {
        const [expiresAt] = createSessionToken().split(".");
        const forged =
          `${expiresAt}.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
        assertEquals<boolean>(isValidSessionToken(forged), false);
      });
    });

    await t.step("有効期限だけ引き伸ばしたトークンは無効", async () => {
      await withAccount(() => {
        const [expiresAt, signature] = createSessionToken().split(".");
        const extended = `${Number(expiresAt) + 60 * 60}.${signature}`;
        assertEquals<boolean>(isValidSessionToken(extended), false);
      });
    });

    await t.step("パスワードを変更すると発行済みトークンは無効", async () => {
      await withAccount(() => {
        const token = createSessionToken();
        Deno.env.set("PASSWORD", "newpassword");
        assertEquals<boolean>(isValidSessionToken(token), false);
      });
    });

    await t.step("Cookieがない場合は無効", async () => {
      await withAccount(() => {
        assertEquals<boolean>(isValidSessionToken(undefined), false);
      });
    });

    await t.step("形式が不正な文字列は無効", async () => {
      await withAccount(() => {
        for (const token of ["", ".", "abc", "abc.def", "1.2.3"]) {
          assertEquals<boolean>(isValidSessionToken(token), false);
        }
      });
    });
  },
);

Deno.test(
  { name: "セッションCookieの発行", permissions: { env: true } },
  async (t) => {
    await t.step("Cookie属性が付与される", async () => {
      await withAccount(() => {
        const headers = new Headers();
        setSessionCookie(headers);
        const cookie = headers.get("set-cookie") ?? "";

        assertStringIncludes(cookie, "session=");
        assertStringIncludes(cookie, "HttpOnly");
        assertStringIncludes(cookie, "Secure");
        assertStringIncludes(cookie, "SameSite=Lax");
        assertStringIncludes(cookie, "Path=/");
        assertStringIncludes(cookie, "Max-Age=604800");
      });
    });

    await t.step("パスワードはCookieに載らない", async () => {
      await withAccount(() => {
        const headers = new Headers();
        setSessionCookie(headers);
        assertEquals<boolean>(
          (headers.get("set-cookie") ?? "").includes(PASSWORD),
          false,
        );
      });
    });

    await t.step("平文Cookieを失効させる", () => {
      const headers = new Headers();
      clearLegacyCookies(headers);
      const cookie = headers.getSetCookie().join("\n");

      assertStringIncludes(cookie, "username=;");
      assertStringIncludes(cookie, "password=;");
    });
  },
);

Deno.test(
  { name: "リクエストのログイン判定", permissions: { env: true } },
  async (t) => {
    await t.step("有効なセッションCookieがあればログイン済み", async () => {
      await withAccount(() => {
        const req = new Request("http://localhost/dashboard", {
          headers: { cookie: `session=${createSessionToken()}` },
        });
        assertEquals<boolean>(isLoggedIn(req), true);
      });
    });

    await t.step("平文Cookieだけではログイン済みにならない", async () => {
      await withAccount(() => {
        const req = new Request("http://localhost/dashboard", {
          headers: { cookie: `username=${USERNAME}; password=${PASSWORD}` },
        });
        assertEquals<boolean>(isLoggedIn(req), false);
      });
    });

    await t.step("Requestがなければ未ログイン", () => {
      assertEquals<boolean>(isLoggedIn(), false);
    });
  },
);

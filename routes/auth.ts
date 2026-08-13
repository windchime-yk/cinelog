import { define } from "~/utils.ts";
import { getUrlParams, redirectResponse } from "~/core/api.ts";
import { clearLegacyCookies, setSessionCookie } from "~/core/session.ts";
import { isInvalidAccount } from "~/core/util.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const body = await getUrlParams(ctx.req);
    const response = redirectResponse("/");

    // ログインの成否によらず、平文保存していた頃のCookieは消す
    clearLegacyCookies(response.headers);

    if (!isInvalidAccount(body.get("username"), body.get("password"))) {
      setSessionCookie(response.headers);
    }

    return response;
  },
});

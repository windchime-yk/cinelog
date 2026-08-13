import { define } from "~/utils.ts";
import { getUrlParams, redirectResponse } from "~/core/api.ts";
import { setSessionCookie } from "~/core/session.ts";
import { isInvalidAccount } from "~/core/util.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const body = await getUrlParams(ctx.req);
    const response = redirectResponse("/");

    if (!isInvalidAccount(body.get("username"), body.get("password"))) {
      setSessionCookie(response.headers);
    }

    return response;
  },
});

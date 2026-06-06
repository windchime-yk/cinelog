import { define } from "~/utils.ts";
import { setCookie } from "@std/http/cookie";
import { getUrlParams, redirectResponse } from "~/core/api.ts";
import { isInvalidAccount } from "~/core/util.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const body = await getUrlParams(ctx.req);
    const response = redirectResponse("/");

    if (!isInvalidAccount(body.get("username"), body.get("password"))) {
      setCookie(response.headers, {
        name: "username",
        value: body.get("username") || "",
      });
      setCookie(response.headers, {
        name: "password",
        value: body.get("password") || "",
      });
    }

    return response;
  },
});

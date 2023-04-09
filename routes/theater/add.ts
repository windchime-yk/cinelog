import { type Handlers } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import { getUrlParams, redirectResponse } from "../../core/api.ts";
import { addTheaterInfo } from "../../core/ps.ts";
import { isInvalidAccount } from "../../core/util.ts";

export const handler: Handlers = {
  async POST(req) {
    const body = await getUrlParams(req);
    const cookie = getCookies(req.headers);

    if (!isInvalidAccount(cookie.username, cookie.password)) {
      addTheaterInfo({
        table: "tbl_theater",
        inserts: {
          name: body.get("theater") as string,
        },
      });
    }

    return redirectResponse("/dashboard");
  },
};

import { define } from "~/utils.ts";
import { getCookies } from "@std/http/cookie";
import { getUrlParams, redirectResponse } from "~/core/api.ts";
import { db } from "~/core/db.ts";
import { isInvalidAccount } from "~/core/util.ts";
import { theaterTable } from "~/db/schema.ts";
import type { NewTheater } from "~/db/model.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const body = await getUrlParams(ctx.req);
    const cookie = getCookies(ctx.req.headers);

    if (!isInvalidAccount(cookie.username, cookie.password)) {
      const newTheater: NewTheater = {
        name: body.get("theater")!,
      };
      await db.insert(theaterTable).values(newTheater);
    }

    return redirectResponse("/dashboard");
  },
});

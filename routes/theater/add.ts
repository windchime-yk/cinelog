import { type Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { getUrlParams, redirectResponse } from "~/core/api.ts";
import { db } from "~/core/db.ts";
import { isInvalidAccount } from "~/core/util.ts";
import { theaterTable } from "~/db/schema.ts";
import type { NewTheater } from "~/db/model.ts";

export const handler: Handlers = {
  async POST(req) {
    const body = await getUrlParams(req);
    const cookie = getCookies(req.headers);

    if (!isInvalidAccount(cookie.username, cookie.password)) {
      const newTheater: NewTheater = {
        name: body.get("theater")!,
      };
      await db.insert(theaterTable).values(newTheater);
    }

    return redirectResponse("/dashboard");
  },
};

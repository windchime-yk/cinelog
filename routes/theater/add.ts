import { define } from "~/utils.ts";
import { monotonicUlid } from "@std/ulid";
import { getUrlParams, redirectResponse } from "~/core/api.ts";
import { db } from "~/core/db.ts";
import { isLoggedIn } from "~/core/session.ts";
import { validateMasterName } from "~/core/validate.ts";
import { theaterTable } from "~/db/schema.ts";
import type { NewTheater } from "~/db/model.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const body = await getUrlParams(ctx.req);

    if (!isLoggedIn(ctx.req)) {
      return redirectResponse("/login");
    }

    const name = body.get("theater");
    const errorCode = validateMasterName(name);
    if (errorCode) return redirectResponse(`/dashboard?error=${errorCode}`);

    const newTheater: NewTheater = { id: monotonicUlid(), name: name! };

    try {
      await db.insert(theaterTable).values(newTheater);
    } catch (error) {
      console.error(error);
      // nameはUNIQUE制約のため、重複登録でもここに到達する
      return redirectResponse("/dashboard?error=duplicate-name");
    }

    return redirectResponse("/dashboard");
  },
});

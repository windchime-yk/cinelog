import { define } from "~/utils.ts";
import { getCookies } from "@std/http/cookie";
import { getUrlParams, redirectResponse } from "~/core/api.ts";
import { db } from "~/core/db.ts";
import { isInvalidAccount } from "~/core/util.ts";
import { validateMasterName } from "~/core/validate.ts";
import { companionTypeTable } from "~/db/schema.ts";
import type { NewCompanionType } from "~/db/model.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const body = await getUrlParams(ctx.req);
    const cookie = getCookies(ctx.req.headers);

    if (isInvalidAccount(cookie.username, cookie.password)) {
      return redirectResponse("/login");
    }

    const name = body.get("companion_type");
    const errorCode = validateMasterName(name);
    if (errorCode) return redirectResponse(`/dashboard?error=${errorCode}`);

    const newCompanionType: NewCompanionType = { name: name! };

    try {
      await db.insert(companionTypeTable).values(newCompanionType);
    } catch (error) {
      console.error(error);
      // nameはUNIQUE制約のため、重複登録でもここに到達する
      return redirectResponse("/dashboard?error=duplicate-name");
    }

    return redirectResponse("/dashboard");
  },
});

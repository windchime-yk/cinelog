import { type Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { getUrlParams, redirectResponse } from "~/core/api.ts";
import { db } from "~/core/db.ts";
import { Convert } from "~/core/convert.ts";
import { isInvalidAccount } from "~/core/util.ts";
import { movieTable, type NewMovie } from "~/db/schema/movie.ts";

export const handler: Handlers = {
  async POST(req) {
    const body = await getUrlParams(req);
    const cookie = getCookies(req.headers);

    if (!isInvalidAccount(cookie.username, cookie.password)) {
      const convert = new Convert();

      const newMovie: NewMovie = {
        title: body.get("title")!,
        is_dubbed: convert.isFormToDatabase(body.get("is_dubbed")),
        is_domestic: convert.isFormToDatabase(body.get("is_domestic")),
        is_live_action: convert.isFormToDatabase(body.get("is_live_action")),
        theater_id: Number(body.get("theater_id")),
        view_date: Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" })
          .format(
            new Date(body.get("view_date") ?? ""),
          ),
        view_start_time: body.get("view_start_time"),
        view_end_time: body.get("view_end_time"),
        accompanier: body.get("accompanier")
          ? Number(body.get("accompanier"))
          : null,
        rating: body.get("rating") ? Number(body.get("rating")) : null,
        comment: body.get("comment"),
      };

      await db.insert(movieTable).values(newMovie);
    }

    return redirectResponse("/");
  },
};

import { define } from "~/utils.ts";
import { getCookies } from "@std/http/cookie";
import { getUrlParams, redirectResponse } from "~/core/api.ts";
import { db } from "~/core/db.ts";
import { Convert } from "~/core/convert.ts";
import { isInvalidAccount } from "~/core/util.ts";
import { validateMovieForm } from "~/core/validate.ts";
import { movieTable } from "~/db/schema.ts";
import type { NewMovie } from "~/db/model.ts";

/**
 * 数値の入力値をDBのnullableなint型に変換する
 * @param value フォームから取得した値
 */
const toNullableNumber = (value: string | null): number | null =>
  value ? Number(value) : null;

/**
 * 未選択（空文字）をNULLに変換する
 * @param value フォームから取得した値
 */
const toNullableString = (value: string | null): string | null => value || null;

export const handler = define.handlers({
  async POST(ctx) {
    const body = await getUrlParams(ctx.req);
    const cookie = getCookies(ctx.req.headers);

    if (isInvalidAccount(cookie.username, cookie.password)) {
      return redirectResponse("/login");
    }

    const errorCode = validateMovieForm(body);
    if (errorCode) return redirectResponse(`/dashboard?error=${errorCode}`);

    const convert = new Convert();
    const viewDate = body.get("view_date");
    const startTime = body.get("view_start_time");
    const endTime = body.get("view_end_time");

    // 上映終了時間が上映開始時間以下なら、日を跨いだ鑑賞とみなす
    const isCrossDay = convert.isCrossDay(startTime, endTime);
    // 「日を跨ぐ」のチェックと計算結果が食い違う場合は入力ミスとみなし、登録しない
    if (isCrossDay !== convert.isFormToDatabase(body.get("is_cross_day"))) {
      return redirectResponse("/dashboard?error=cross-day-mismatch");
    }

    const newMovie: NewMovie = {
      title: body.get("title")!,
      is_dubbed: convert.isFormToDatabase(body.get("is_dubbed")),
      is_domestic: convert.isFormToDatabase(body.get("is_domestic")),
      is_live_action: convert.isFormToDatabase(body.get("is_live_action")),
      theater_id: body.get("theater_id")!,
      format_id: toNullableString(body.get("format_id")),
      view_start_datetime: convert.formatDatetime(viewDate, startTime),
      view_end_datetime: convert.formatDatetime(
        isCrossDay ? convert.addDays(viewDate, 1) : viewDate,
        endTime,
      ),
      accompanier: toNullableNumber(body.get("accompanier")),
      companion_type_id: toNullableString(body.get("companion_type_id")),
      rating: toNullableNumber(body.get("rating")),
      comment: body.get("comment") || null,
    };

    try {
      await db.insert(movieTable).values(newMovie);
    } catch (error) {
      console.error(error);
      return redirectResponse("/dashboard?error=insert-failed");
    }

    return redirectResponse("/");
  },
});

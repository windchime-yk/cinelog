import { isDateString, isTimeString } from "~/core/convert.ts";
import type { DashboardErrorCode } from "~/core/message.ts";
import { ULID_LENGTH } from "~/db/schema.ts";

/** 名称系カラムの最大文字数 */
const MAX_NAME_LENGTH = 246;
/** 評価の下限 */
const MIN_RATING = 1;
/** 評価の上限 */
const MAX_RATING = 5;
/** ULIDの形式（Crockford Base32。I・L・O・Uは使われない） */
const ULID_PATTERN = new RegExp(`^[0-9A-HJKMNP-TV-Z]{${ULID_LENGTH}}$`);

/**
 * 外部キーとして使えるULIDか
 * @param value フォームの入力値
 */
const isUlid = (value: string | null): boolean =>
  !!value && ULID_PATTERN.test(value);

/**
 * 未入力、ないし指定範囲の整数か
 * @param value フォームの入力値
 * @param min 下限
 * @param max 上限
 */
const isOptionalInteger = (
  value: string | null,
  min: number,
  max: number,
): boolean => {
  if (!value) return true;
  const num = Number(value);
  return Number.isInteger(num) && num >= min && num <= max;
};

/**
 * 未入力、ないし外部キーとして使えるULIDか
 * @param value フォームの入力値
 */
const isOptionalUlid = (value: string | null): boolean =>
  !value || isUlid(value);

/**
 * 鑑賞作品フォームの入力値を検証する
 * @param body フォームの入力値
 * @returns 最初に見つかったエラーコード。問題なければnull
 */
export const validateMovieForm = (
  body: URLSearchParams,
): DashboardErrorCode | null => {
  const title = body.get("title");
  if (!title || title.length > MAX_NAME_LENGTH) return "invalid-title";

  // 「選択してください」のvalueは空文字なので、未選択もここで弾く
  if (!isUlid(body.get("theater_id"))) return "invalid-theater";

  if (!isDateString(body.get("view_date"))) return "invalid-datetime";
  if (!isTimeString(body.get("view_start_time"))) return "invalid-datetime";
  if (!isTimeString(body.get("view_end_time"))) return "invalid-datetime";

  if (!isOptionalUlid(body.get("format_id"))) return "invalid-format";
  if (!isOptionalUlid(body.get("companion_type_id"))) {
    return "invalid-companion-type";
  }
  if (
    !isOptionalInteger(body.get("accompanier"), 0, Number.MAX_SAFE_INTEGER)
  ) {
    return "invalid-accompanier";
  }
  if (!isOptionalInteger(body.get("rating"), MIN_RATING, MAX_RATING)) {
    return "invalid-rating";
  }

  return null;
};

/**
 * マスタデータ追加フォームの名称を検証する
 * @param name 入力された名称
 * @returns エラーコード。問題なければnull
 */
export const validateMasterName = (
  name: string | null,
): DashboardErrorCode | null => {
  if (!name || name.length > MAX_NAME_LENGTH) return "invalid-name";
  return null;
};

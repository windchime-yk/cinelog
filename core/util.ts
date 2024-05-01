import type { PickMovie } from "~/db/model.ts";

/**
 * ユーザー名かパスワードがシステム側に保存されているものと一致するか
 * @param username ユーザー名
 * @param password パスワード
 * @returns
 */
export const isInvalidAccount = (
  username: string | null,
  password: string | null,
): boolean =>
  username !== Deno.env.get("USERNAME") ||
  password !== Deno.env.get("PASSWORD");

/**
 * 経過時間か"不明"を表示する
 * @param movie 鑑賞作品データ
 */
export const elapsedTime = (diff: PickMovie["diff"]) =>
  diff === 0 ? "不明" : `${diff}分`;

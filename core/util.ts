import type { PickMovie } from "~/db/model.ts";
import { config } from "~/config.ts";

/**
 * ユーザー名かパスワードがシステム側に保存されているものと一致するか
 * @param username ユーザー名
 * @param password パスワード
 * @returns
 */
export const isInvalidAccount = (
  username: string | null,
  password: string | null,
): boolean => {
  console.log({
    username,
    config_username: config.username,
    password,
    config_password: config.password,
  });

  return username !== config.username || password !== config.password;
};

/**
 * 経過時間か"不明"を表示する
 * @param movie 鑑賞作品データ
 */
export const elapsedTime = (diff: PickMovie["diff"]) =>
  diff === 0 ? "不明" : `${diff}分`;

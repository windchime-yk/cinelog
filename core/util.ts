import { type PickMovie } from "~/db/schema/movie.ts";
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
): boolean => username !== config.username || password !== config.password;

/**
 * 上映開始時間と終了時間から上映時間を算出する
 * @param startTime 上映開始時間
 * @param lastTime 上映終了時間
 */
const caliculateShowtimes = (
  startTime: string,
  lastTime: string,
): number => {
  const diff = new Date(lastTime).getTime() - new Date(startTime).getTime();
  // TODO: もしdiffがマイナスだったらlastTimeを分解して次の日にしてから再計算させる
  return diff / 60_000;
};

/**
 * 経過時間か"不明"を表示する
 * @param movie 鑑賞作品データ
 */
export const elapsedTime = (movie: PickMovie) =>
  movie.view_start_time === null || movie.view_end_time === null
    ? "不明"
    : `${
      caliculateShowtimes(
        `${movie.view_date} ${movie.view_start_time}`,
        `${movie.view_date} ${movie.view_end_time}`,
      )
    }分`;

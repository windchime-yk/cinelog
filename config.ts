import { dotenv } from "./deps.ts";

const { USERNAME, PASSWORD } = await dotenv.config();

/** 環境変数 */
export const config = {
  username: USERNAME ?? Deno.env.get("USERNAME"),
  password: PASSWORD ?? Deno.env.get("PASSWORD"),
};

export const SITE_NAME = "シネログ";

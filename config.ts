import { load } from "std/dotenv/mod.ts";

const { USERNAME, PASSWORD, PS_HOST, PS_USERNAME, PS_PASSWORD } = await load();

/** 環境変数 */
export const config = {
  username: USERNAME ?? Deno.env.get("USERNAME"),
  password: PASSWORD ?? Deno.env.get("PASSWORD"),
  ps_host: PS_HOST ?? Deno.env.get("PS_HOST"),
  ps_username: PS_USERNAME ?? Deno.env.get("PS_USERNAME"),
  ps_password: PS_PASSWORD ?? Deno.env.get("PS_PASSWORD"),
};

export const SITE_NAME = "シネログ";

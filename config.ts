import "std/dotenv/load.ts";

/** 環境変数 */
export const config = {
  username: Deno.env.get("USERNAME"),
  password: Deno.env.get("PASSWORD"),
  ps_host: Deno.env.get("PS_HOST"),
  ps_username: Deno.env.get("DEVELOP") ? Deno.env.get("PS_DEV_USERNAME") : Deno.env.get("PS_USERNAME"),
  ps_password: Deno.env.get("DEVELOP") ? Deno.env.get("PS_DEV_PASSWORD") : Deno.env.get("PS_PASSWORD"),
};

export const SITE_NAME = "シネログ";

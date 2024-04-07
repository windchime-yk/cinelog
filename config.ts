import "$std/dotenv/load.ts";

/** 環境変数 */
export const config = {
  username: Deno.env.get("USERNAME"),
  password: Deno.env.get("PASSWORD"),
  db_host: Deno.env.get("DB_HOST"),
  db_username: Deno.env.get("DEVELOP")
    ? Deno.env.get("DB_DEV_USERNAME")
    : Deno.env.get("DB_USERNAME"),
  db_password: Deno.env.get("DEVELOP")
    ? Deno.env.get("DB_DEV_PASSWORD")
    : Deno.env.get("DB_PASSWORD"),
};

export const SITE_NAME = "シネログ";

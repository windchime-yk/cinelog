import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "planetscale";
import "std/dotenv/load.ts";

const connection = connect({
  host: Deno.env.get("PS_HOST"),
  username: Deno.env.get("DEVELOP")
    ? Deno.env.get("PS_DEV_USERNAME")
    : Deno.env.get("PS_USERNAME"),
  password: Deno.env.get("DEVELOP")
    ? Deno.env.get("PS_DEV_PASSWORD")
    : Deno.env.get("PS_PASSWORD"),
});

export const db = drizzle(connection);

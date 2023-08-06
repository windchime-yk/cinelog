// @deno-types="https://esm.sh/v130/drizzle-orm@0.27.2/planetscale-serverless/index.d.ts"
import { drizzle } from "drizzle-orm/planetscale-serverless";
// @deno-types="https://esm.sh/v130/@planetscale/database@1.10.0/dist/index.d.ts"
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

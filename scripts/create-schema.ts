import { $ } from "jsr:@david/dax@0.40.1";

$.logGroup("npm setup");
await $`npm init -y`.quiet("stdout");
$.log("package.json created");
await $`npm i -D drizzle-orm@0.45.2 drizzle-kit@0.31.10`.quiet();
$.log("Dependencies installed");
$.logGroupEnd();

$.logGroup("Schema generate");
// drizzle-kit 0.21以降はgenerate:mysqlが廃止され、generate --dialectになった
// npmの取得に2秒以上かかるため、timeoutとnoThrowを付けると失敗が握り潰される
await $`deno run -A --node-modules-dir npm:drizzle-kit generate --dialect=mysql --schema=./db/schema.ts --out=./drizzle`;
$.log("Drizzle ORM schema generated");
$.logGroupEnd();

$.logGroup("Cleaning");
await $`git clean -f node_modules package.json package-lock.json`.quiet();
$.log("Setup file deleted");
$.logGroupEnd();

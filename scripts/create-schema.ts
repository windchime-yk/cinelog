import { $ } from "jsr:@david/dax@0.40.1";

$.logGroup("npm setup");
await $`npm init -y`.quiet("stdout");
$.log("package.json created");
await $`npm i -D drizzle-orm drizzle-kit`.quiet();
$.log("Dependencies installed");
$.logGroupEnd();

$.logGroup("Schema generate");
await $`deno run -A --node-modules-dir npm:drizzle-kit generate:mysql --schema=./db/schema.ts`
  .quiet().timeout(2000).noThrow();
$.log("Drizzle ORM schema generated");
$.logGroupEnd();

$.logGroup("Cleaning");
await $`git clean -f node_modules package.json package-lock.json`.quiet();
$.log("Setup file deleted");
$.logGroupEnd();

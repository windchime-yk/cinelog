import { Builder } from "fresh/dev";

const builder = new Builder();

if (Deno.args.includes("build")) {
  await builder.build(() => import("./main.ts"));
} else {
  await builder.listen(() => import("./main.ts"));
}

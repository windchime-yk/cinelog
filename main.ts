import "@std/dotenv/load";
import { App, fsRoutes, staticFiles } from "fresh";

const app = new App<{ title?: string }>();
app.use(staticFiles());
await fsRoutes(app, {
  dir: "./",
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}

export { app };

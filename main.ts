import "@std/dotenv/load";
import { App, staticFiles } from "fresh";

export const app = new App<{ title?: string }>();
app.use(staticFiles());

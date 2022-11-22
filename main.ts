import { type Handler, html, serve, UnoCSS } from "./deps.ts";
import { TopPage } from "./components/pages/TopPage.tsx";
import { ListPage } from "./components/pages/ListPage.tsx";
import { LoginPage } from "./components/pages/LoginPage.tsx";
import { DashboardPage } from "./components/pages/DashboardPage.tsx";
import { AuthPage } from "./components/pages/redirect/AuthPage.tsx";
import { AddMoviePage } from "./components/pages/redirect/movie/Add.tsx";
import { NotFoundPage } from "./components/pages/error/NotFoundPage.tsx";
import { cinelogApi } from "./api/mod.ts";

html.use(UnoCSS());

const handler: Handler = (req) => {
  const { pathname } = new URL(req.url);

  // 主要画面系
  if (pathname === "/") return TopPage(req);
  if (pathname === "/list") return ListPage(req);
  if (pathname === "/login") return LoginPage(req);
  if (pathname === "/dashboard") return DashboardPage(req);

  // リダイレクト画面系
  if (pathname === "/auth") return AuthPage(req);
  if (pathname === "/movie/add") return AddMoviePage(req);

  // API
  if (pathname === "/api") return cinelogApi(req);

  // 404画面
  return NotFoundPage(req);
};

const PORT = 8080;
serve(handler, { addr: `:${PORT}` });
console.log(`listen to http://localhost:${PORT}`);

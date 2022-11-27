import { type Handler, html, serve, UnoCSS } from "./deps.ts";
import { TopPage } from "./pages/TopPage.tsx";
import { ListPage } from "./pages/ListPage.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { DashboardPage } from "./pages/DashboardPage.tsx";
import { SearchPage } from "./pages/SearchPage.tsx";
import { AuthRedirect } from "./pages/redirect/auth.ts";
import { AddMovieRedirect } from "./pages/redirect/movie/add.ts";
import { NotFoundPage } from "./pages/error/NotFoundPage.tsx";
import { cinelogApi } from "./api/mod.ts";

html.use(UnoCSS());

const handler: Handler = (req) => {
  const { pathname } = new URL(req.url);

  // 主要画面系
  if (pathname === "/") return TopPage(req);
  if (pathname === "/list") return ListPage(req);
  if (pathname === "/login") return LoginPage(req);
  if (pathname === "/dashboard") return DashboardPage(req);
  if (pathname === "/search") return SearchPage(req);

  // リダイレクト画面系
  if (pathname === "/auth") return AuthRedirect(req);
  if (pathname === "/movie/add") return AddMovieRedirect(req);

  // API
  if (pathname === "/api") return cinelogApi(req);

  // 404画面
  return NotFoundPage(req);
};

const PORT = 8080;
serve(handler, { addr: `:${PORT}` });
console.log(`listen to http://localhost:${PORT}`);

/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { Fragment, h, html, statusCode } from "../../deps.ts";
import { elapsedTime, fetchMovieInfo, getUrlParams } from "../../core.ts";
import { Heading } from "../atoms/Heading.tsx";
import { Header } from "../organisms/Header.tsx";
import { Main } from "../organisms/Main.tsx";
import { Footer } from "../organisms/Footer.tsx";
import { SITE_NAME } from "../../config.ts";

/**
 * 検索画面
 * @param req Request
 * @returns HTMLレスポンス
 */
export const SearchPage = async (req: Request): Promise<Response> => {
  const body = await getUrlParams(req);
  const search = body.get("search");
  const title = search ? "検索結果" : "検索画面";
  const movies = await fetchMovieInfo({
    fields: ["title", "view_date", "view_start_time", "view_end_time"],
    search,
  });

  return html({
    title: `${title} | ${SITE_NAME}`,
    status: statusCode.ok,
    lang: "ja",
    body: (
      <>
        <Header req={req} />
        <Main>
          <section>
            <Heading level={2}>鑑賞作品の検索</Heading>
            <form action="/search" method="post">
              <input type="text" name="search" value={search ?? ""} />
              <button class="mt-6 py-2 px-5 bg-dark c-light" type="submit">
                検索
              </button>
            </form>
          </section>
          <section>
            <Heading level={2}>検索結果</Heading>
            {movies.length === 0 && (
              <span class="block mt-5">該当する検索結果はありませんでした。</span>
            )}
            {movies.map((movie) => {
              return (
                <section class="flex max-w-2xl flex-col mx-a mt-5 pt-3 pb-5 px-2 border">
                  <Heading className="order-2 text-center" level={3}>
                    {movie.title}
                  </Heading>
                  <ul class="flex gap-2 order-1">
                    <li>
                      <time>{movie.view_date}</time>
                    </li>
                    <li>
                      <time>{elapsedTime(movie)}</time>
                    </li>
                  </ul>
                </section>
              );
            })}
          </section>
        </Main>
        <Footer />
      </>
    ),
  });
};

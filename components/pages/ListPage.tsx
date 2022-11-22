/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { Fragment, h, html, statusCode } from "../../deps.ts";
import { elapsedTime, fetchMovieInfo } from "../../core.ts";
import { Heading } from "../atoms/Heading.tsx";
import { Header } from "../organisms/Header.tsx";
import { Main } from "../organisms/Main.tsx";
import { Footer } from "../organisms/Footer.tsx";
import { SITE_NAME } from "../../config.ts";

/**
 * 鑑賞作品一覧画面
 * @param req Request
 * @returns JSX
 */
export const ListPage = async (req: Request): Promise<Response> => {
  const movies = await fetchMovieInfo({
    fields: ["title", "view_date", "view_start_time", "view_end_time"],
  });

  return html({
    title: `鑑賞作品一覧 | ${SITE_NAME}`,
    status: statusCode.ok,
    lang: "ja",
    body: (
      <>
        <Header req={req} />
        <Main>
          <section class="px-5 mt-9">
            <Heading level={2}>すべての鑑賞作品</Heading>
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

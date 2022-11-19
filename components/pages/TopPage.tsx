/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { Fragment, h, html, statusCode } from "../../deps.ts";
import { caliculateShowtimes, fetchMovieInfo } from "../../core.ts";
import { Heading } from "../atoms/Heading.tsx";
import { Header } from "../organisms/Header.tsx";
import { Main } from "../organisms/Main.tsx";
import { Footer } from "../organisms/Footer.tsx";
import { SITE_NAME } from "../../config.ts";
import type { MovieInfo } from "../../model.ts";

/**
 * TOP画面
 * @returns JSX
 */
export const TopPage = async (req: Request): Promise<Response> => {
  const elapsedTime = (movie: MovieInfo) =>
    movie.view_start_time === null || movie.view_end_time === null
      ? "不明"
      : `${
        caliculateShowtimes(
          `${movie.view_date} ${movie.view_start_time}`,
          `${movie.view_date} ${movie.view_end_time}`,
        )
      }分`;
  const movies = await fetchMovieInfo();

  return html({
    title: SITE_NAME,
    status: statusCode.ok,
    lang: "ja",
    body: (
      <>
        <Header req={req} />
        <Main>
          <p>このWebサイトは、WhyKが映画館で鑑賞した映画をただ記録していくところです。感想や評価は今のところ載せる予定はありません。</p>
          <p>なお、APIも提供されています。</p>

          <section class="px-5 mt-9">
            <Heading level={2}>直近の鑑賞10作品</Heading>
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

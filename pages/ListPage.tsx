/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { Fragment, h, html, statusCode } from "../deps.ts";
import { fetchMovieInfo } from "../core/ps.ts";
import { elapsedTime } from "../core/util.ts";
import { Heading } from "../components/atoms/Heading.tsx";
import { Header } from "../components/organisms/Header.tsx";
import { Main } from "../components/organisms/Main.tsx";
import { Card } from "../components/organisms/Card.tsx";
import { Footer } from "../components/organisms/Footer.tsx";
import { SITE_NAME } from "../config.ts";

/**
 * 鑑賞作品一覧画面
 * @param req Request
 * @returns HTMLレスポンス
 */
export const ListPage = async (req: Request): Promise<Response> => {
  const movies = await fetchMovieInfo({
    table: "tbl_movieinfo",
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
            {movies.length
              ? movies.map((movie) => {
                return (
                  <Card
                    title={movie.title}
                    viewDate={movie.view_date}
                    viewTime={elapsedTime(movie)}
                  />
                );
              })
              : <p>データ取得失敗により表示するものがありません</p>}
          </section>
        </Main>
        <Footer />
      </>
    ),
  });
};

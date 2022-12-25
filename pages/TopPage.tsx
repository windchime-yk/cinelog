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
 * TOP画面
 * @param req Request
 * @returns HTMLレスポンス
 */
export const TopPage = async (req: Request): Promise<Response> => {
  const movies = await fetchMovieInfo({
    table: "tbl_movieinfo",
    fields: ["title", "view_date", "view_start_time", "view_end_time"],
    limit: 10,
  });

  return html({
    title: SITE_NAME,
    status: statusCode.ok,
    lang: "ja",
    body: (
      <>
        <Header req={req} />
        <Main>
          <p>
            このWebサイトは、WhyKが映画館で鑑賞した映画をただ記録していくところです。感想や評価は今のところ載せる予定はありません。
          </p>
          <p>なお、APIも提供されています。</p>

          <section class="px-5 mt-9">
            <Heading level={2}>クイック検索</Heading>
            <form action="/search" method="post">
              <input type="text" name="search" />
              <button class="mt-6 py-2 px-5 bg-dark c-light" type="submit">
                検索
              </button>
            </form>
          </section>

          <section class="px-5 mt-9">
            <Heading level={2}>直近の鑑賞10作品</Heading>
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

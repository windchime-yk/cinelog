import { type Handlers, type PageProps } from "$fresh/server.ts";
import { fetchMovieInfo } from "../core/ps.ts";
import { elapsedTime } from "../core/util.ts";
import { Heading } from "../components/atoms/Heading.tsx";
import { Card } from "../components/organisms/Card.tsx";
import { Layout } from "../components/organisms/Layout.tsx";
import type { MovieInfo } from "../model.ts";
import { MovieCardList } from "../components/organisms/MovieCardList.tsx";
import { Button } from "../components/atoms/Button.tsx";
import { Input, SearchField } from "../components/organisms/Input.tsx";

type HandlerProps = {
  req: Request;
  movies: Array<MovieInfo>;
};

export const handler: Handlers<HandlerProps> = {
  async GET(req, ctx) {
    const movies = await fetchMovieInfo({
      table: "tbl_movieinfo",
      fields: ["title", "view_date", "view_start_time", "view_end_time"],
      limit: 10,
    });
    return ctx.render({ req, movies });
  },
};

export default function Home({ data }: PageProps<HandlerProps>) {
  const { req, movies } = data;
  return (
    <Layout req={req}>
      <p>
        このWebサイトは、WhyKが映画館で鑑賞した映画をただ記録していくところです。感想や評価は今のところ載せる予定はありません。
      </p>
      <p>なお、APIも提供されています。</p>

      <section class="mt-12">
        <Heading level={2}>クイック検索</Heading>
        <form action="/search" method="post">
          <SearchField />
        </form>
      </section>

      <section class="mt-12">
        <Heading level={2}>直近の鑑賞10作品</Heading>
        {movies.length !== 0
          ? <MovieCardList movies={movies} />
          : <p>データ取得失敗により表示するものがありません</p>}
      </section>
    </Layout>
  );
}

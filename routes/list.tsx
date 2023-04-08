import { type Handlers, type PageProps } from "$fresh/server.ts";
import { fetchMovieInfo } from "../core/ps.ts";
import { elapsedTime } from "../core/util.ts";
import { Heading } from "../components/atoms/Heading.tsx";
import { Card } from "../components/organisms/Card.tsx";
import { Layout } from "../components/organisms/Layout.tsx";
import type { MovieInfo } from "../model.ts";

type HandlerProps = {
  req: Request;
  movies: Array<MovieInfo>;
};

export const handler: Handlers<HandlerProps> = {
  async GET(req, ctx) {
    const movies = await fetchMovieInfo({
      table: "tbl_movieinfo",
      fields: ["title", "view_date", "view_start_time", "view_end_time"],
    });
    return ctx.render({ req, movies });
  },
};

export default function List({ data }: PageProps<HandlerProps>) {
  const { req, movies } = data;
  return (
    <Layout title="鑑賞作品一覧" req={req}>
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
    </Layout>
  );
}

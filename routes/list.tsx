import { type Handlers, type PageProps } from "$fresh/server.ts";
import { desc } from "drizzle-orm";
import { db } from "~/core/db.ts";
import { movieTable, type PickMovie } from "~/db/schema/movie.ts";
import { Heading } from "~/components/atoms/Heading.tsx";
import { Layout } from "~/components/organisms/Layout.tsx";
import { MovieCardList } from "~/components/organisms/MovieCardList.tsx";

type HandlerProps = {
  req: Request;
  movies: Array<PickMovie>;
};

export const handler: Handlers<HandlerProps> = {
  async GET(req, ctx) {
    const movies = await db.select({
      title: movieTable.title,
      view_date: movieTable.view_date,
      view_start_time: movieTable.view_start_time,
      view_end_time: movieTable.view_end_time,
    }).from(movieTable).orderBy(desc(movieTable.view_date));

    return ctx.render({ req, movies });
  },
};

export default function List({ data }: PageProps<HandlerProps>) {
  const { req, movies } = data;
  return (
    <Layout title="鑑賞作品一覧" req={req}>
      <section>
        <Heading level={2}>すべての鑑賞作品</Heading>
        {movies.length
          ? <MovieCardList movies={movies} />
          : <p>データ取得失敗により表示するものがありません</p>}
      </section>
    </Layout>
  );
}

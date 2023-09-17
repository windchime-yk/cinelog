import { type Handlers, type PageProps } from "$fresh/server.ts";
import { desc, sql } from "drizzle-orm";
import { db } from "~/core/db.ts";
import { movieTable } from "~/db/schema.ts";
import type { PickMovie } from "~/db/model.ts";
import { Heading } from "~/components/atoms/Heading.tsx";
import { Layout } from "~/components/organisms/Layout.tsx";
import { SearchField } from "~/components/organisms/Input.tsx";
import { MovieCardList } from "~/components/organisms/MovieCardList.tsx";

type HandlerProps = {
  req: Request;
  movies: Array<PickMovie>;
};

export const handler: Handlers<HandlerProps> = {
  async GET(req, ctx) {
    const movies = await db.select({
      title: movieTable.title,
      view_date: sql<
        string
      >`DATE_FORMAT(DATE(${movieTable.view_start_datetime}), '%Y/%m/%d')`,
      diff: sql<
        string
      >`TIMESTAMPDIFF(MINUTE, ${movieTable.view_start_datetime}, ${movieTable.view_end_datetime})`,
    }).from(movieTable).limit(10).orderBy(desc(movieTable.view_start_datetime));

    return ctx.render({ req, movies });
  },
};

export default function Home({ data }: PageProps<HandlerProps>) {
  const { req, movies } = data;
  return (
    <Layout req={req}>
      <p>
        このWebサイトは、WhyKが映画館で鑑賞した映画をただ記録していくところです。<br />感想や評価は今のところ載せる予定はありません。
      </p>
      <p className="mt-3">
        また、記載されている上映時間については劇場での上映時間であり、序盤の予告を含んでいるため実際の尺より少し長くなっています。
      </p>
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

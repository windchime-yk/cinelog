import { type Handlers, type PageProps } from "$fresh/server.ts";
import { desc, like, sql } from "drizzle-orm";
import { getUrlParams } from "~/core/api.ts";
import { db } from "~/core/db.ts";
import { movieTable, type PickMovie } from "~/db/schema/movie.ts";
import { Heading } from "~/components/atoms/Heading.tsx";
import { Layout } from "~/components/organisms/Layout.tsx";
import { MovieCardList } from "~/components/organisms/MovieCardList.tsx";
import { SearchField } from "~/components/organisms/Input.tsx";

type HandlerProps = {
  req: Request;
  search?: string | null;
  movies: Array<PickMovie>;
};

export const handler: Handlers<HandlerProps> = {
  GET(req, ctx) {
    const movies: Array<PickMovie> = [];
    return ctx.render({ req, movies });
  },
  async POST(req, ctx) {
    const body = await getUrlParams(req);
    const search = body.get("search");

    const movies = await db.select({
      title: movieTable.title,
      view_date: sql<
        string
      >`DATE_FORMAT(DATE(${movieTable.view_start_datetime}), '%Y/%m/%d')`,
      diff: sql<
        string
      >`TIMESTAMPDIFF(MINUTE, ${movieTable.view_start_datetime}, ${movieTable.view_end_datetime})`,
    }).from(movieTable).where(like(movieTable.title, `%${search}%`)).orderBy(
      desc(movieTable.view_start_datetime),
    );

    return ctx.render({ req, movies, search });
  },
};

const PAGE_TITLE = "鑑賞作品の検索";

export default function Search({ data }: PageProps<HandlerProps>) {
  const { req, movies, search } = data;

  const showContent = () => {
    if (!search) {
      return (
        <span class="block mt-5">
          検索されていないため表示するものがありません
        </span>
      );
    } else if (movies.length === 0) {
      return (
        <span class="block mt-5">該当する検索結果はありませんでした。</span>
      );
    } else {
      return <MovieCardList movies={movies} />;
    }
  };

  return (
    <Layout title={PAGE_TITLE} req={req}>
      <section>
        <Heading level={2}>{PAGE_TITLE}</Heading>
        <form action="/search" method="post">
          <SearchField value={search ?? ""} />
        </form>
      </section>
      <section class="mt-12">
        <Heading level={2}>検索結果</Heading>
        {showContent()}
      </section>
    </Layout>
  );
}

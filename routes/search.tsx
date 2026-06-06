import { define } from "~/utils.ts";
import { desc, like, sql } from "drizzle-orm";
import { getUrlParams } from "~/core/api.ts";
import { db } from "~/core/db.ts";
import { movieTable } from "~/db/schema.ts";
import { Heading } from "~/components/atoms/Heading.tsx";
import { Layout } from "~/components/organisms/Layout.tsx";
import { MovieCardList } from "~/components/organisms/MovieCardList.tsx";
import { SearchField } from "~/components/organisms/Input.tsx";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.movies = [];
    return ctx.render();
  },
  async POST(ctx) {
    const body = await getUrlParams(ctx.req);
    const search = body.get("search");

    ctx.state.search = search;
    ctx.state.movies = await db.select({
      title: movieTable.title,
      view_date: sql<
        string
      >`DATE_FORMAT(DATE(${movieTable.view_start_datetime}), '%Y/%m/%d')`,
      diff: sql<
        number
      >`TIMESTAMPDIFF(MINUTE, ${movieTable.view_start_datetime}, ${movieTable.view_end_datetime})`,
    }).from(movieTable).where(like(movieTable.title, `%${search}%`)).orderBy(
      desc(movieTable.view_start_datetime),
    );

    return ctx.render();
  },
});

const PAGE_TITLE = "鑑賞作品の検索";

export default define.page(function Search({ state, req }) {
  const movies = state.movies ?? [];
  const search = state.search;

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
});

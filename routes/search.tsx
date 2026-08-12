import { define } from "~/utils.ts";
import { getUrlParams } from "~/core/api.ts";
import { searchCardData } from "~/core/db.ts";
import { Heading } from "~/components/atoms/Heading.tsx";
import { Layout } from "~/components/organisms/Layout.tsx";
import { MovieCardList } from "~/components/organisms/MovieCardList.tsx";
import { SearchField } from "~/components/organisms/Input.tsx";

export const handler = define.handlers({
  GET(_ctx) {
    return { data: { movies: [], search: null } };
  },
  async POST(ctx) {
    const body = await getUrlParams(ctx.req);
    const search = body.get("search");

    const movies = await searchCardData(search);

    return { data: { movies, search } };
  },
});

const PAGE_TITLE = "鑑賞作品の検索";

export default define.page<typeof handler>(function Search({ data, req }) {
  const movies = data.movies ?? [];
  const search = data.search;

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

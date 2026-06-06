import { define } from "~/utils.ts";
import { getCardData } from "~/core/db.ts";
import { Heading } from "~/components/atoms/Heading.tsx";
import { Layout } from "~/components/organisms/Layout.tsx";
import { MovieCardList } from "~/components/organisms/MovieCardList.tsx";

export const handler = define.handlers({
  async GET(_ctx) {
    const movies = await getCardData();
    return { data: { movies } };
  },
});

export default define.page<typeof handler>(function List({ data, req }) {
  const movies = data.movies ?? [];
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
});

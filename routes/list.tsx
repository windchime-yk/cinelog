import { define } from "~/utils.ts";
import { getCardData } from "~/core/db.ts";
import type { PickMovie } from "~/db/model.ts";
import { Heading } from "~/components/atoms/Heading.tsx";
import { Layout } from "~/components/organisms/Layout.tsx";
import { MovieCardList } from "~/components/organisms/MovieCardList.tsx";

type HandlerData = {
  req: Request;
  movies: Array<PickMovie>;
};

export const handler = define.handlers<HandlerData>({
  async GET(ctx) {
    const movies = await getCardData();

    return ctx.render({ req: ctx.req, movies });
  },
});

export default define.page<HandlerData>(function List({ data }) {
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
});

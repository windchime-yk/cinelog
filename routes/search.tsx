import { type Handlers, type PageProps } from "$fresh/server.ts";
import { getUrlParams } from "../core/api.ts";
import { fetchMovieInfo } from "../core/ps.ts";
import { Heading } from "../components/atoms/Heading.tsx";
import { Layout } from "../components/organisms/Layout.tsx";
import type { MovieInfo } from "../model.ts";
import { MovieCardList } from "../components/organisms/MovieCardList.tsx";
import { SearchField } from "../components/organisms/Input.tsx";

type HandlerProps = {
  req: Request;
  search?: string | null;
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
  async POST(req, ctx) {
    const body = await getUrlParams(req);
    const search = body.get("search");
    const movies = await fetchMovieInfo({
      table: "tbl_movieinfo",
      fields: ["title", "view_date", "view_start_time", "view_end_time"],
      where: search ? "title" : undefined,
      like: search,
    });
    return ctx.render({ req, movies, search });
  },
};

const PAGE_TITLE = "鑑賞作品の検索";

export default function Search({ data }: PageProps<HandlerProps>) {
  const { req, movies, search } = data;
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
        {movies.length === 0 && (
          <span class="block mt-5">
            該当する検索結果はありませんでした。
          </span>
        )}
        {<MovieCardList movies={movies} />}
      </section>
    </Layout>
  );
}

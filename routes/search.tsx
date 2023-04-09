import { type Handlers, type PageProps } from "$fresh/server.ts";
import { getUrlParams } from "../core/api.ts";
import { fetchMovieInfo } from "../core/ps.ts";
import { elapsedTime } from "../core/util.ts";
import { Heading } from "../components/atoms/Heading.tsx";
import { Card } from "../components/organisms/Card.tsx";
import { Layout } from "../components/organisms/Layout.tsx";
import type { MovieInfo } from "../model.ts";

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
          <input type="text" name="search" value={search ?? ""} />
          <button class="mt-6 py-2 px-5 bg-black text-white" type="submit">
            検索
          </button>
        </form>
      </section>
      <section>
        <Heading level={2}>検索結果</Heading>
        {movies.length === 0 && (
          <span class="block mt-5">
            該当する検索結果はありませんでした。
          </span>
        )}
        {movies.map((movie) => {
          return (
            <Card
              title={movie.title}
              viewDate={movie.view_date}
              viewTime={elapsedTime(movie)}
            />
          );
        })}
      </section>
    </Layout>
  );
}

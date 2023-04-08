import { type Handlers, type PageProps } from "$fresh/server.ts";
import { fetchTheaterInfo } from "../core/ps.ts";
import { Heading } from "../components/atoms/Heading.tsx";
import { Layout } from "../components/organisms/Layout.tsx";
import type { TheaterInfo } from "../model.ts";

type HandlerProps = {
  req: Request;
  theaters: Array<TheaterInfo>;
};

export const handler: Handlers<HandlerProps> = {
  async GET(req, ctx) {
    const theaters = await fetchTheaterInfo({
      table: "tbl_theater",
      fields: ["id", "name"],
    });
    return ctx.render({ req, theaters });
  },
};

const PAGE_TITLE = "ダッシュボード";

export default function Dashboard({ data }: PageProps<HandlerProps>) {
  const { req, theaters } = data;

  // const cookie = getCookies(req.headers);
  // if (isInvalidAccount(cookie.username, cookie.password)) {
  //   return redirectResponse("/login");
  // }

  return (
    <Layout title={PAGE_TITLE} req={req}>
      <section>
        <Heading level={2}>鑑賞作品の追加</Heading>
        <form action="/movie/add" method="post">
          <table>
            <tr>
              <th class="c-white bg-gray text-left py-1 px-2">
                <label htmlFor="title">タイトル</label>
              </th>
              <td class="bg-light py-1 px-2">
                <input type="text" name="title" required />
              </td>
            </tr>
            <tr>
              <th class="c-white bg-gray text-left py-1 px-2">
                <label htmlFor="is_dubbed">字幕版かどうか</label>
              </th>
              <td class="bg-light py-1 px-2">
                <input type="checkbox" name="is_dubbed" />
              </td>
            </tr>
            <tr>
              <th class="c-white bg-gray text-left py-1 px-2">
                <label htmlFor="is_domestic">国内映画かどうか</label>
              </th>
              <td class="bg-light py-1 px-2">
                <input type="checkbox" name="is_domestic" />
              </td>
            </tr>
            <tr>
              <th class="c-white bg-gray text-left py-1 px-2">
                <label htmlFor="is_live_action">実写かどうか</label>
              </th>
              <td class="bg-light py-1 px-2">
                <input type="checkbox" name="is_live_action" />
              </td>
            </tr>
            <tr>
              <th class="c-white bg-gray text-left py-1 px-2">
                <label htmlFor="theater_id">鑑賞した映画館</label>
              </th>
              <td class="bg-light py-1 px-2">
                <select name="theater_id" required>
                  <option value="0">選択してください</option>
                  {theaters.map((theater) => {
                    return <option value={theater.id}>{theater.name}</option>;
                  })}
                </select>
              </td>
            </tr>
            <tr>
              <th class="c-white bg-gray text-left py-1 px-2">
                <label htmlFor="view_date">鑑賞日</label>
              </th>
              <td class="bg-light py-1 px-2">
                <input type="date" name="view_date" required />
              </td>
            </tr>
            <tr>
              <th class="c-white bg-gray text-left py-1 px-2">
                <label htmlFor="view_start_time">上映開始時間</label>
              </th>
              <td class="bg-light py-1 px-2">
                <input type="time" name="view_start_time" required />
              </td>
            </tr>
            <tr>
              <th class="c-white bg-gray text-left py-1 px-2">
                <label htmlFor="view_end_time">上映終了時間</label>
              </th>
              <td class="bg-light py-1 px-2">
                <input type="time" name="view_end_time" required />
              </td>
            </tr>
            <tr>
              <th class="c-white bg-gray text-left py-1 px-2">
                <label htmlFor="accompanier">同伴者</label>
              </th>
              <td class="bg-light py-1 px-2">
                <input type="number" name="accompanier" />名
              </td>
            </tr>
            <tr>
              <th class="c-white bg-gray text-left py-1 px-2">
                <label htmlFor="rating">評価</label>
              </th>
              <td class="bg-light py-1 px-2">
                <input type="number" name="rating" />
              </td>
            </tr>
            <tr>
              <th class="c-white bg-gray text-left py-1 px-2">
                <label htmlFor="comment">コメント</label>
              </th>
              <td class="bg-light py-1 px-2">
                <input type="text" name="comment" />
              </td>
            </tr>
          </table>
          <button class="mt-6 py-2 px-5 bg-black text-white" type="submit">
            追加
          </button>
        </form>
      </section>

      <section>
        <Heading level={2}>鑑賞した映画館の追加</Heading>
        <form action="/theater/add" method="post">
          <table>
            <tr>
              <th class="c-white bg-gray text-left py-1 px-2">
                <label htmlFor="theater">館名</label>
              </th>
              <td class="bg-light py-1 px-2">
                <input type="text" name="theater" required />
              </td>
            </tr>
          </table>
          <button class="mt-6 py-2 px-5 bg-black text-white" type="submit">
            追加
          </button>
        </form>
      </section>
    </Layout>
  );
}

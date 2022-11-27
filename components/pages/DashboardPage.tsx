/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { Fragment, getCookies, h, html, statusCode } from "../../deps.ts";
import { isInvalidAccount, redirectResponse } from "../../core.ts";
import { Heading } from "../atoms/Heading.tsx";
import { Header } from "../organisms/Header.tsx";
import { Main } from "../organisms/Main.tsx";
import { Footer } from "../organisms/Footer.tsx";
import { SITE_NAME } from "../../config.ts";

/**
 * ダッシュボード画面
 * @param req Request
 * @returns HTMLレスポンス
 */
export const DashboardPage = (req: Request): Promise<Response> | Response => {
  const cookie = getCookies(req.headers);
  if (isInvalidAccount(cookie.username, cookie.password)) {
    return redirectResponse("/login");
  }

  return html({
    title: `鑑賞作品の追加 | ${SITE_NAME}`,
    status: statusCode.ok,
    lang: "ja",
    body: (
      <>
        <Header req={req} />
        <Main>
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
                    <label htmlFor="theater">鑑賞した映画館</label>
                  </th>
                  <td class="bg-light py-1 px-2">
                    <input type="text" name="theater" required />
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
              <button class="mt-6 py-2 px-5 bg-dark c-light" type="submit">
                追加
              </button>
            </form>
          </section>
        </Main>
        <Footer />
      </>
    ),
  });
};

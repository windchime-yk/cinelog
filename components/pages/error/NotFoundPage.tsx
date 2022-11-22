/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { Fragment, h, html, statusCode } from "../../../deps.ts";
import { Header } from "../../organisms/Header.tsx";
import { Main } from "../../organisms/Main.tsx";
import { Footer } from "../../organisms/Footer.tsx";
import { SITE_NAME } from "../../../config.ts";
import { Heading } from "../../atoms/Heading.tsx";

/**
 * 404画面
 * @param req Request
 * @returns HTMLレスポンス
 */
export const NotFoundPage = (req: Request): Promise<Response> => {
  return html({
    title: `404 Not Found | ${SITE_NAME}`,
    status: statusCode.notFound,
    lang: "ja",
    body: (
      <>
        <Header req={req} />
        <Main>
          <section>
            <Heading level={2}>404 Not Found</Heading>
            <p>
              存在しない画面にアクセスしています。<a href="/">TOP画面</a>に移動してください。
            </p>
          </section>
        </Main>
        <Footer />
      </>
    ),
  });
};

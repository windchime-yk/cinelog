/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { Fragment, h, html, statusCode } from "../deps.ts";
import { Heading } from "../components/atoms/Heading.tsx";
import { Header } from "../components/organisms/Header.tsx";
import { Main } from "../components/organisms/Main.tsx";
import { Footer } from "../components/organisms/Footer.tsx";
import { SITE_NAME } from "../config.ts";

/**
 * ログイン画面
 * @param req Request
 * @returns HTMLレスポンス
 */
export const LoginPage = (req: Request): Promise<Response> => {
  return html({
    title: `ログイン | ${SITE_NAME}"`,
    status: statusCode.ok,
    lang: "ja",
    body: (
      <>
        <Header req={req} />
        <Main>
          <section>
            <Heading level={2}>ログイン</Heading>
            <form action="/auth" method="post">
              <input type="text" name="username" />
              <input type="password" name="password" />
              <button type="submit">ログイン</button>
            </form>
          </section>
        </Main>
        <Footer />
      </>
    ),
  });
};

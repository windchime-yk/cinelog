import { Head } from "fresh/runtime";
import { type ComponentChildren, type VNode } from "preact";
import { Header } from "~/components/organisms/Header.tsx";
import { Main } from "~/components/organisms/Main.tsx";
import { Footer } from "~/components/organisms/Footer.tsx";
import { SITE_NAME } from "~/config.ts";

interface LayoutProps {
  req?: Request;
  title?: string;
  // 条件付きレンダリングの結果を受け取れるよう、VNode以外も許容する
  children: ComponentChildren;
}

export const Layout = ({ req, title, children }: LayoutProps): VNode => (
  <>
    {title && (
      <Head>
        <title>{title} | {SITE_NAME}</title>
      </Head>
    )}
    <div
      class="min-h-screen grid bg-gray-50 dark:bg-gray-900 dark:text-white"
      style={{
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      <Header req={req} />
      <Main>{children}</Main>
      <Footer />
    </div>
  </>
);

import { Head } from "$fresh/runtime.ts";
import { type VNode } from "preact";
import { Header } from "~/components/organisms/Header.tsx";
import { Main } from "~/components/organisms/Main.tsx";
import { Footer } from "~/components/organisms/Footer.tsx";
import { SITE_NAME } from "~/config.ts";

interface LayoutProps {
  req?: Request;
  title?: string;
  children: VNode | VNode[];
}

export const Layout = ({ req, title, children }: LayoutProps): VNode => (
  <>
    <Head>
      <title>{title ? `${title} | ${SITE_NAME}` : SITE_NAME}</title>
      <link rel="shortcut icon" href="favicon.jpg" type="image/jpeg" />
    </Head>
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

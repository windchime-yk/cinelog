import { Head } from "$fresh/runtime.ts";
import { type VNode } from "preact";
import { Header } from "./Header.tsx";
import { Main } from "./Main.tsx";
import { Footer } from "./Footer.tsx";
import { SITE_NAME } from "../../config.ts";

interface LayoutProps {
  req?: Request;
  title?: string;
  children: VNode | VNode[];
}

export const Layout = ({ req, title, children }: LayoutProps): VNode => (
  <>
    <Head>
      <title>{title ? `${title} | ${SITE_NAME}` : SITE_NAME}</title>
    </Head>
    <Header req={req} />
    <Main>{children}</Main>
    <Footer />
  </>
);

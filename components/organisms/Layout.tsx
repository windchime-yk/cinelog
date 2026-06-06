import { type VNode } from "preact";
import { Header } from "~/components/organisms/Header.tsx";
import { Main } from "~/components/organisms/Main.tsx";
import { Footer } from "~/components/organisms/Footer.tsx";

interface LayoutProps {
  req?: Request;
  title?: string;
  children: VNode | VNode[];
}

export const Layout = ({ req, children }: LayoutProps): VNode => (
  <>
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

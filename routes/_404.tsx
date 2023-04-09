import { Heading } from "../components/atoms/Heading.tsx";
import { Layout } from "../components/organisms/Layout.tsx";

const PAGE_TITLE = "404 Not Found";

export default function Login() {
  return (
    <Layout title={PAGE_TITLE}>
      <section>
        <Heading level={2}>{PAGE_TITLE}</Heading>
        <p>
          存在しない画面にアクセスしています。<a href="/">
            TOP画面
          </a>に移動してください。
        </p>
      </section>
    </Layout>
  );
}

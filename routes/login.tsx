import { type Handlers, type PageProps } from "$fresh/server.ts";
import { Heading } from "../components/atoms/Heading.tsx";
import { Layout } from "../components/organisms/Layout.tsx";

type HandlerProps = {
  req: Request;
};

export const handler: Handlers<HandlerProps> = {
  GET(req, ctx) {
    return ctx.render({ req });
  },
};

const PAGE_TITLE = "ログイン";

export default function Login({ data }: PageProps<HandlerProps>) {
  const { req } = data;
  return (
    <Layout title={PAGE_TITLE} req={req}>
      <section>
        <Heading level={2}>{PAGE_TITLE}</Heading>
        <form action="/auth" method="post">
          <input type="text" name="username" />
          <input type="password" name="password" />
          <button type="submit">ログイン</button>
        </form>
      </section>
    </Layout>
  );
}

import { type Handlers, type PageProps } from "$fresh/server.ts";
import { Button } from "../components/atoms/Button.tsx";
import { Heading } from "../components/atoms/Heading.tsx";
import { Input } from "../components/organisms/Input.tsx";
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
          <fieldset className="flex flex-col md:flex-row gap-5">
            <Input
              className="w-3/5 md:w-auto"
              rounded="both"
              label="ユーザー名"
              name="username"
            />
            <Input
              className="w-3/5 md:w-auto"
              rounded="both"
              type="password"
              label="パスワード"
              name="password"
            />
          </fieldset>
          <Button className="block rounded-lg mt-5" type="submit">
            ログイン
          </Button>
        </form>
      </section>
    </Layout>
  );
}

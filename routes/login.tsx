import { define } from "~/utils.ts";
import { Button } from "~/components/atoms/Button.tsx";
import { Heading } from "~/components/atoms/Heading.tsx";
import { Input } from "~/components/organisms/Input.tsx";
import { Layout } from "~/components/organisms/Layout.tsx";

type HandlerData = {
  req: Request;
};

export const handler = define.handlers<HandlerData>({
  GET(ctx) {
    return ctx.render({ req: ctx.req });
  },
});

const PAGE_TITLE = "ログイン";

export default define.page<HandlerData>(function Login({ data }) {
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
});

import { type Handlers, type PageProps } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import { redirectResponse } from "../core/api.ts";
import { fetchTheaterInfo } from "../core/ps.ts";
import { isInvalidAccount } from "../core/util.ts";
import { Heading } from "../components/atoms/Heading.tsx";
import { Layout } from "../components/organisms/Layout.tsx";
import type { TheaterInfo } from "../model.ts";
import {
  Checkbox,
  Input,
  Select,
  Textarea,
} from "../components/organisms/Input.tsx";
import { Button } from "../components/atoms/Button.tsx";

type HandlerProps = {
  req: Request;
  theaters: Array<TheaterInfo>;
};

export const handler: Handlers<HandlerProps> = {
  async GET(req, ctx) {
    const cookie = getCookies(req.headers);

    if (isInvalidAccount(cookie.username, cookie.password)) {
      return redirectResponse("/login");
    }

    const theaters = await fetchTheaterInfo({
      table: "tbl_theater",
      fields: ["id", "name"],
    });
    return ctx.render({ req, theaters });
  },
};

const PAGE_TITLE = "ダッシュボード";

export default function Dashboard({ data }: PageProps<HandlerProps>) {
  const { req, theaters } = data;

  return (
    <Layout title={PAGE_TITLE} req={req}>
      <section>
        <Heading level={2}>鑑賞作品の追加</Heading>
        <form action="/movie/add" method="post">
          <Input
            className="w-4/5 md:w-3/5 lg:w-1/3"
            rounded="both"
            name="title"
            label="タイトル"
            required
          />
          <fieldset class="flex gap-5 mt-6">
            <legend class="mb-2 text-sm font-medium">映画属性</legend>
            <Checkbox label="字幕版か" name="is_dubbed" />
            <Checkbox label="邦画か" name="is_domestic" />
            <Checkbox label="実写版か" name="is_live_action" />
          </fieldset>
          <Select
            className="mt-6"
            label="鑑賞した映画館"
            name="theater_id"
            required
          >
            <option value="0">選択してください</option>
            <>
              {theaters.map((theater) => {
                return <option value={theater.id}>{theater.name}</option>;
              })}
            </>
          </Select>
          <fieldset class="flex flex-col md:flex-row mt-6 gap-6 md:gap-3">
            <Input
              rounded="both"
              type="date"
              name="view_date"
              label="鑑賞日"
              required
            />
            <Input
              rounded="both"
              type="time"
              name="view_start_time"
              label="上映開始時間"
              required
            />
            <Input
              rounded="both"
              type="time"
              name="view_end_time"
              label="上映終了時間"
              required
            />
          </fieldset>
          <fieldset class="flex flex-col md:flex-row mt-6 gap-6 md:gap-3">
            <Input
              rounded="both"
              type="number"
              name="view_end_time"
              label="同伴者"
            />
            <Input
              rounded="both"
              type="number"
              name="view_end_time"
              label="評価"
            />
          </fieldset>
          <Textarea
            className="w-full md:w-4/5 h-32 mt-6"
            name="comment"
            label="コメント"
          />
          <Button className="mt-6 rounded-lg" type="submit">追加</Button>
        </form>
      </section>

      <section class="mt-12">
        <Heading level={2}>鑑賞した映画館の追加</Heading>
        <form action="/theater/add" method="post">
          <Input rounded="both" name="theater" label="館名" required />
          <Button className="block mt-6 rounded-lg" type="submit">追加</Button>
        </form>
      </section>
    </Layout>
  );
}

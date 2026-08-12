import { type VNode } from "preact";
import { define } from "~/utils.ts";
import { getCookies } from "@std/http/cookie";
import { redirectResponse } from "~/core/api.ts";
import { getMasterData } from "~/core/db.ts";
import { getDashboardErrorMessage } from "~/core/message.ts";
import { isInvalidAccount } from "~/core/util.ts";
import type { MasterRecord } from "~/db/model.ts";
import { Heading } from "~/components/atoms/Heading.tsx";
import { Layout } from "~/components/organisms/Layout.tsx";
import {
  Checkbox,
  Input,
  Select,
  Textarea,
} from "~/components/organisms/Input.tsx";
import { Button } from "~/components/atoms/Button.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const cookie = getCookies(ctx.req.headers);

    if (isInvalidAccount(cookie.username, cookie.password)) {
      return redirectResponse("/login");
    }

    const url = new URL(ctx.req.url);
    const errorMessage = getDashboardErrorMessage(url.searchParams.get(
      "error",
    ));
    const { theaters, formats, companionTypes } = await getMasterData();

    return { data: { theaters, formats, companionTypes, errorMessage } };
  },
});

const PAGE_TITLE = "ダッシュボード";

/**
 * マスタデータからセレクトボックスの選択肢を生成する
 * @param records マスタデータ
 * @param placeholder 未選択時に表示する文言
 */
const masterOptions = (
  records: Array<MasterRecord>,
  placeholder: string,
): VNode[] => [
  <option key="placeholder" value="">{placeholder}</option>,
  ...(records.length !== 0
    ? records.map((record) => (
      <option key={record.id} value={record.id}>{record.name}</option>
    ))
    : [
      <option key="empty" value="" disabled>
        データベースから値が取得できませんでした
      </option>,
    ]),
];

export default define.page<typeof handler>(function Dashboard(
  { data, req },
) {
  const theaters = data.theaters ?? [];
  const formats = data.formats ?? [];
  const companionTypes = data.companionTypes ?? [];
  const errorMessage = data.errorMessage;

  return (
    <Layout title={PAGE_TITLE} req={req}>
      {errorMessage && (
        <p
          role="alert"
          class="mb-6 p-4 text-sm text-red-800 bg-red-100 rounded-lg dark:bg-gray-800 dark:text-red-400"
        >
          {errorMessage}
        </p>
      )}

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
            <Checkbox label="字幕版か" name="is_subtitled" />
            <Checkbox label="邦画か" name="is_domestic" />
            <Checkbox label="実写版か" name="is_live_action" />
          </fieldset>
          <Select
            className="mt-6"
            label="鑑賞した映画館"
            name="theater_id"
            required
          >
            {masterOptions(theaters, "選択してください")}
          </Select>
          <Select
            className="mt-6"
            label="鑑賞形式"
            name="format_id"
          >
            {masterOptions(formats, "指定なし")}
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
            <Checkbox
              className="md:self-end md:pb-3"
              label="日を跨ぐ"
              name="is_cross_day"
            />
          </fieldset>
          <fieldset class="flex flex-col md:flex-row mt-6 gap-6 md:gap-3">
            <Input
              rounded="both"
              type="number"
              name="accompanier"
              label="同伴者"
              min={0}
            />
            <Select label="同伴者分類" name="companion_type_id">
              {masterOptions(companionTypes, "指定なし")}
            </Select>
            <Input
              rounded="both"
              type="number"
              name="rating"
              label="評価"
              min={1}
              max={5}
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

      <section class="mt-12">
        <Heading level={2}>鑑賞形式の追加</Heading>
        <form action="/format/add" method="post">
          <Input rounded="both" name="format" label="形式名" required />
          <Button className="block mt-6 rounded-lg" type="submit">追加</Button>
        </form>
      </section>

      <section class="mt-12">
        <Heading level={2}>同伴者分類の追加</Heading>
        <form action="/companion-type/add" method="post">
          <Input
            rounded="both"
            name="companion_type"
            label="分類名"
            required
          />
          <Button className="block mt-6 rounded-lg" type="submit">追加</Button>
        </form>
      </section>
    </Layout>
  );
});

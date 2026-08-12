import { type VNode } from "preact";
import { Heading } from "~/components/atoms/Heading.tsx";

interface CardProps {
  title: string;
  viewDate: string;
  viewTime: string;
  /** 鑑賞形式の名称。指定なしの場合は表示しない */
  format?: string | null;
  /** 字幕版だったか。falseの場合は表示しない */
  isSubtitled?: boolean;
}

/**
 * 鑑賞形式や字幕の有無を示すバッジ。
 *
 * spanのままだとインライン要素で上下paddingが行ボックスの高さに参入せず、
 * 親のitems-centerが実際に描かれるピルとズレた箱を中央揃えしてしまう。
 * inline-flexで実寸の箱にし、leading-noneで余分な行高を除く
 */
const BADGE_CLASS =
  "inline-flex items-center px-2 py-1 text-xs leading-none font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200";

/**
 * バッジ1つ分のリスト項目。
 *
 * liをflexにしているのは、ブロックのままだと親から継承した行高のストラットが
 * 残り、liの高さがバッジの実寸より高くなってしまうため
 */
const BadgeItem = ({ children }: { children: string }): VNode => (
  <li class="flex">
    <span class={BADGE_CLASS}>{children}</span>
  </li>
);

export const Card = (
  { title, viewDate, viewTime, format, isSubtitled }: CardProps,
): VNode => (
  <section
    class="h-full grid grid-cols-subgrid p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    style={{
      gridTemplateRows: "auto 1fr auto",
    }}
  >
    <Heading className="order-2 dark:text-white" level={3}>
      {title}
    </Heading>
    <ul class="flex flex-wrap items-center gap-2 order-1 dark:text-white">
      <li>
        <time>{viewDate}</time>
      </li>
      <li>
        <time>{viewTime}</time>
      </li>
      {format && <BadgeItem>{format}</BadgeItem>}
      {isSubtitled && <BadgeItem>字幕</BadgeItem>}
    </ul>
    <div class="order-2">
      <a
        class="inline-flex items-center mt-5 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-8002"
        href={`https://eiga.com/search/${title.replaceAll("/", "／")}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        映画.comで検索
        <svg
          aria-hidden="true"
          class="w-4 h-4 ml-2 -mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          >
          </path>
        </svg>
      </a>
    </div>
  </section>
);

/** @jsx h */
import { h, VNode } from "../../deps.ts";
import { Heading } from "../atoms/Heading.tsx";

interface CardProps {
  title: string;
  viewDate: string;
  viewTime: string;
}

export const Card = ({ title, viewDate, viewTime }: CardProps): VNode => (
  <section class="flex max-w-2xl flex-col mx-a mt-5 pt-3 pb-5 px-2 border">
    <Heading className="order-2 text-center" level={3}>
      {title}
    </Heading>
    <ul class="flex gap-2 order-1">
      <li>
        <time>{viewDate}</time>
      </li>
      <li>
        <time>{viewTime}</time>
      </li>
    </ul>
    <p class="mt-3 text-right order-3">
      <a
        class="underline"
        href={`https://eiga.com/search/${title}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        映画.comで検索する
      </a>
    </p>
  </section>
);

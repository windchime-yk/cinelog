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
  </section>
);

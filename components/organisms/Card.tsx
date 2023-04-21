import { type VNode } from "preact";
import { Heading } from "../atoms/Heading.tsx";

interface CardProps {
  title: string;
  viewDate: string;
  viewTime: string;
}

export const Card = ({ title, viewDate, viewTime }: CardProps): VNode => (
  <section class="h-full flex flex-col p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <Heading className="order-2 dark:text-white" level={3}>
      {title}
    </Heading>
    <ul class="flex gap-2 order-1 dark:text-white">
      <li>
        <time>{viewDate}</time>
      </li>
      <li>
        <time>{viewTime}</time>
      </li>
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

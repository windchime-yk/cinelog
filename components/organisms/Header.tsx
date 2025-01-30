import { type VNode } from "preact";
import { Heading } from "~/components/atoms/Heading.tsx";
import { SITE_NAME } from "~/config.ts";
import IconMovie from "icons/movie.tsx";
import { getCookies } from "$std/http/cookie.ts";
import { isInvalidAccount } from "~/core/util.ts";

interface HeaderProps {
  req?: Request;
}
interface Links {
  id: string;
  name: string;
  logged?: boolean;
}

const linklist: Array<Links> = [
  {
    id: "dashboard",
    name: "ダッシュボード",
    logged: true,
  },
  {
    id: "login",
    name: "ログイン",
    logged: false,
  },
  {
    id: "search",
    name: "検索",
  },
  {
    id: "list",
    name: "鑑賞作品一覧",
  },
];

export const Header = ({ req }: HeaderProps): VNode => {
  let cookie: Record<string, string> = {};
  if (req) cookie = getCookies(req.headers);
  const isLogin = isInvalidAccount(cookie.username, cookie.password);

  return (
    <header class="bg-white border-gray-200 dark:bg-gray-900">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Heading className="flex items-center dark:text-white" level={1}>
          <IconMovie />
          <a className="ml-2" href="/">{SITE_NAME}</a>
        </Heading>
        <nav class="w-full md:block md:w-auto">
          <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {linklist.map((link) => {
              if (
                link.logged !== undefined &&
                (!isLogin && !link.logged || isLogin && link.logged)
              ) return;

              return (
                <li key={link.id}>
                  <a
                    href={`/${link.id}`}
                    class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    {link.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
};

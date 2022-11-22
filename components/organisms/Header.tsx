/** @jsx h */
import { getCookies, h, VNode } from "../../deps.ts";
import { SITE_NAME } from "../../config.ts";
import { Heading } from "../atoms/Heading.tsx";
import { isInvalidAccount } from "../../core.ts";

interface HeaderProps {
  req: Request;
}

export const Header = ({ req }: HeaderProps): VNode => {
  const cookie = getCookies(req.headers);

  return (
    <header class="flex justify-between items-center py-5 px-5">
      <Heading level={1}>
        <a href="/">{SITE_NAME}</a>
      </Heading>
      <nav>
        <ul class="flex items-center gap-3">
          {!isInvalidAccount(cookie.username, cookie.password) && (
            <li>
              <a class="underline" href="/dashboard">ダッシュボード</a>
            </li>
          )}
          {isInvalidAccount(cookie.username, cookie.password) && (
            <li>
              <a class="underline" href="/login">ログイン</a>
            </li>
          )}
          <li>
            <a class="underline" href="/search">検索</a>
          </li>
          <li>
            <a class="underline" href="/list">鑑賞作品一覧</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

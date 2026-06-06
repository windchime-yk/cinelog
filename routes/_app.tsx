import type { PageProps } from "fresh";
import { SITE_NAME } from "~/config.ts";

export default function App({ Component, state }: PageProps) {
  const title = (state as { title?: string }).title;
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} | ${SITE_NAME}` : SITE_NAME}</title>
        <link rel="shortcut icon" href="favicon.jpg" type="image/jpeg" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}

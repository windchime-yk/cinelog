import { define } from "~/utils.ts";
import { SITE_NAME } from "~/config.ts";

export default define.page(function App({ Component }) {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{SITE_NAME}</title>
        <link rel="shortcut icon" href="/favicon.jpg" type="image/jpeg" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
});

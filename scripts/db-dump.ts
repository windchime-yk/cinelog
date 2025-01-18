const DATABASE_BRANCH = Deno.env.get("DATABASE_BRANCH") as "main" | "develop" | undefined;
const datetimeFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Tokyo",
});
const currentDatetime = datetimeFormatter.format(new Date()).replace(/\D/g, "");
const username = DATABASE_BRANCH === "main" ? Deno.env.get("DB_USERNAME") : Deno.env.get("DB_DEV_USERNAME")
const password = DATABASE_BRANCH === "main" ? Deno.env.get("DB_PASSWORD") : Deno.env.get("DB_DEV_PASSWORD")

// tiup dumpling -u <ユーザー名> -P 4000 -h <TiDB Serverlessのエンドポイント> --filetype sql -t 8 -o /tmp/test -r 200000 -F 4MiB -p <パスワード>
// https://dev.classmethod.jp/articles/export-tidb-data-with-dumpling/
const command = new Deno.Command("tiup", {
  args:
    `dumpling -u ${username} -P 4000 -h ${Deno.env.get("DB_HOST")} -B cinelog --filetype sql -t 8 -o db/sql/dump_${DATABASE_BRANCH}_${currentDatetime} -p ${password}`.split(" ")
});
const { success, stdout, stderr } = await command.output();
const decoder = new TextDecoder();

if (success) {
  console.log(decoder.decode(stdout));
} else {
  console.error(decoder.decode(stderr));
}

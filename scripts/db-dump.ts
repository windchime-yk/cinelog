const DATABASE_BRANCH = Deno.env.get("DATABASE_BRANCH");
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

const command = new Deno.Command("pscale", {
  args:
    `database dump whyk ${DATABASE_BRANCH} --output db/sql/dump_${DATABASE_BRANCH}_${currentDatetime}`
      .split(" "),
});
const { success, stdout, stderr } = await command.output();
const decoder = new TextDecoder();

if (success) {
  console.log(decoder.decode(stdout));
} else {
  console.error(decoder.decode(stderr));
}

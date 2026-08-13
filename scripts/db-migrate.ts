import { connect } from "@tidbcloud/serverless";

/**
 * SQLファイルの適用と単発クエリの実行をTiDBに対して行う。
 *
 * TiDBのDDLはトランザクションにならないため、途中で失敗すると
 * それより前の文は適用済みのまま残る。どこまで進んだかを必ず出力する。
 *
 * 適用済みかどうかの管理はしない。実DBには__drizzle_migrationsテーブルが無く、
 * 0000は手作業で適用済みのため、自動判定すると0000を再実行してしまう。
 * 実行するファイルは引数で明示する。
 *
 * drizzle-ormのmigrate()は意図的に導入していない。理由は2つ。
 *
 * 1. 上記のとおり__drizzle_migrationsテーブルが無いため、初回実行時に
 *    drizzle/meta/_journal.jsonの0000〜0003をすべて未適用と判断して流し直し、
 *    CREATE TABLE tbl_movieinfoで失敗する。
 * 2. 0002_master_id_to_ulid.sqlのように手書き調整が必須のマイグレーションがある。
 *    実DBのマスタIDはint(10) unsignedだがschema.tsはserialを宣言しており、
 *    外部キーの型を一致させるためDDLを実DB側に合わせている。自動生成された
 *    SQLをそのまま流す運用とは相性が悪い。
 *
 * 将来migrate()を導入する場合は、先に__drizzle_migrationsテーブルを作り、
 * 0000〜0003を適用済みとして投入してから切り替えること。
 *
 * 使い方:
 *   # SQLファイルを適用する
 *   deno task db:dev drizzle/0002_master_id_to_ulid.sql
 *   deno task db:dev db/sql/seed_format.sql
 *
 *   # 実行せず中身だけ確認する
 *   deno task db:dev drizzle/0002_master_id_to_ulid.sql --dry-run
 *
 *   # 単発クエリを実行する（確認用）
 *   deno task db:dev --query "SELECT COUNT(*) AS c FROM tbl_format"
 *
 *   # 確認プロンプトを省略する
 *   deno task db:main db/sql/seed_format.sql --yes
 */

const DATABASE_BRANCH = Deno.env.get("DATABASE_BRANCH") as
  | "main"
  | "develop"
  | undefined;

/** 参照のみのクエリか（確認プロンプトを省略してよいか）を判定する */
const READ_ONLY_PATTERN = /^\s*(SELECT|SHOW|DESC|DESCRIBE|EXPLAIN)\b/i;

/**
 * 参照のみのクエリかを判定する。
 *
 * 文の前に説明コメントが付いていても本体で判定できるよう、先頭のコメント行を
 * 落としてから照合する
 * @param statement SQLの1文
 */
const isReadOnlyStatement = (statement: string): boolean => {
  const body = statement
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
  return READ_ONLY_PATTERN.test(body);
};

const exit = (message: string): never => {
  console.error(`%c${message}`, "color: red");
  Deno.exit(1);
};

/**
 * SQLをステートメント単位に分割する。
 *
 * drizzleの `--> statement-breakpoint` を除いたうえで、行末のセミコロンを
 * 区切りとして扱う。文字列リテラル中にセミコロンを含むSQLは想定していない。
 * @param sql SQL全文
 */
const splitStatements = (sql: string): string[] => {
  const statements: string[] = [];
  let buffer: string[] = [];

  const flush = () => {
    const statement = buffer.join("\n").trim();
    buffer = [];
    // コメントと空行だけのかたまりは実行しない
    const hasCode = statement.split("\n").some((line) => {
      const trimmed = line.trim();
      return trimmed !== "" && !trimmed.startsWith("--");
    });
    if (hasCode) statements.push(statement.replace(/;\s*$/, ""));
  };

  for (const line of sql.split("\n")) {
    if (line.trim().startsWith("-->")) continue;
    buffer.push(line);
    if (/;\s*$/.test(line)) flush();
  }
  flush();

  return statements;
};

/**
 * クエリ結果を表形式で出力する
 * @param rows 実行結果
 */
const printRows = (rows: unknown) => {
  if (!Array.isArray(rows)) {
    console.log(rows);
    return;
  }
  if (rows.length === 0) {
    console.log("(0 行)");
    return;
  }
  console.table(rows);
  console.log(`(${rows.length} 行)`);
};

const flags = Deno.args.filter((arg) => arg.startsWith("--"));
const isDryRun = flags.includes("--dry-run");
const skipsConfirm = flags.includes("--yes");

const queryIndex = Deno.args.indexOf("--query");
const query = queryIndex !== -1 ? Deno.args[queryIndex + 1] : undefined;
// --queryの値はフラグの引数なので、ファイルパスの候補から除く
const queryValueIndex = queryIndex === -1 ? -1 : queryIndex + 1;
const positional = Deno.args.filter((arg, i) =>
  !arg.startsWith("--") && i !== queryValueIndex
);

if (!DATABASE_BRANCH) {
  exit(
    "DATABASE_BRANCH が未指定です。deno task db:dev / db:main を使ってください",
  );
}
if (queryIndex !== -1 && !query) {
  exit("--query の後にSQLを指定してください");
}
if (!query && positional.length !== 1) {
  exit(
    "適用するSQLファイルを1つ指定してください（例: drizzle/0002_master_id_to_ulid.sql）\n" +
      '単発クエリの場合は --query "SELECT ..." を使ってください',
  );
}

const statements = query
  ? [query]
  : splitStatements(await Deno.readTextFile(positional[0]));

console.log(`ブランチ : ${DATABASE_BRANCH}`);
console.log(
  `対象     : ${
    query ? "単発クエリ" : positional[0]
  }（${statements.length}文）`,
);

if (isDryRun) {
  statements.forEach((statement, index) => {
    console.log(`\n--- ${index + 1}/${statements.length} ---\n${statement}`);
  });
  console.log("\n--dry-run のため実行していません");
  Deno.exit(0);
}

const username = DATABASE_BRANCH === "main"
  ? Deno.env.get("DB_USERNAME")
  : Deno.env.get("DB_DEV_USERNAME");
const password = DATABASE_BRANCH === "main"
  ? Deno.env.get("DB_PASSWORD")
  : Deno.env.get("DB_DEV_PASSWORD");

if (!username || !password) {
  exit(`${DATABASE_BRANCH} の接続情報が .env に設定されていません`);
}

const connection = connect({
  host: Deno.env.get("DB_HOST"),
  username,
  password,
  database: "cinelog",
});

// ホストは共通でユーザー名だけでブランチが決まる構成のため、接続先を必ず表示する
const [identity] = await connection.execute(
  "SELECT DATABASE() AS db, CURRENT_USER() AS user",
) as Array<{ db: string; user: string }>;
console.log(`接続先   : ${identity.user} @ ${identity.db}`);

const isReadOnly = statements.every(isReadOnlyStatement);
if (!isReadOnly && !skipsConfirm) {
  const answer = prompt(
    `\n上記に ${statements.length} 文を適用します。続けますか？ (yes/no)`,
  );
  if (answer !== "yes") {
    console.log("中止しました");
    Deno.exit(0);
  }
}

let applied = 0;
try {
  for (const [index, statement] of statements.entries()) {
    const label = `${index + 1}/${statements.length}`;
    if (!isReadOnly) {
      console.log(`[${label}] ${statement.split("\n")[0].slice(0, 80)}`);
    }
    const result = await connection.execute(statement);
    if (isReadOnlyStatement(statement)) printRows(result);
    applied++;
  }
} catch (error) {
  console.error(`\n%c${applied + 1}文目で失敗しました`, "color: red");
  console.error(error);
  if (!isReadOnly) {
    console.error(
      `\n%c1〜${applied}文目は適用済みのまま残っています。` +
        `TiDBのDDLはロールバックされないため、やり直す場合は手動で戻してください`,
      "color: yellow",
    );
  }
  Deno.exit(1);
}

if (!isReadOnly) {
  console.log(`\n%c${applied}文すべて適用しました`, "color: green");
}

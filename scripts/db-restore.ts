import { connect } from "@tidbcloud/serverless";

/**
 * mainのdumpをdevelopに流し込み、developを本番と同じデータにする。
 *
 * developには分かりやすさ優先のダミーデータしか入っていないため、
 * そのままではマイグレーションの動作確認にならない。特に外部キーの
 * 張り替えを伴う移行は、実データのidを前提に書かれていることがあり、
 * ダミーのままだと検証にならないどころか失敗する。
 *
 * 事故を防ぐため、接続先はdevelopに固定してある。mainには流せない。
 *
 * 使い方:
 *   deno task db:restore                                  # 最新のdump_main_*を使う
 *   deno task db:restore db/sql/dump_main_<timestamp>     # dumpを指定する
 *   deno task db:restore --dry-run                        # 実行せず内容だけ見る
 */

/** dumpの置き場所 */
const SQL_DIR = "db/sql";
/** 削除する順序。外部キーの子から先に消す */
const DELETE_ORDER = [
  "tbl_movieinfo",
  "tbl_format",
  "tbl_companion_type",
  "tbl_theater",
] as const;
/** 投入する順序。外部キーの親から先に入れる */
const INSERT_ORDER = [
  "tbl_theater",
  "tbl_format",
  "tbl_companion_type",
  "tbl_movieinfo",
] as const;

const exit = (message: string): never => {
  console.error(`%c${message}`, "color: red");
  Deno.exit(1);
};

const flags = Deno.args.filter((arg) => arg.startsWith("--"));
const isDryRun = flags.includes("--dry-run");
const skipsConfirm = flags.includes("--yes");
const [specifiedDir] = Deno.args.filter((arg) => !arg.startsWith("--"));

/** 最新のmain dumpディレクトリを探す */
const findLatestDump = async (): Promise<string> => {
  const dirs: string[] = [];
  for await (const entry of Deno.readDir(SQL_DIR)) {
    if (entry.isDirectory && entry.name.startsWith("dump_main_")) {
      dirs.push(entry.name);
    }
  }
  if (dirs.length === 0) {
    exit(
      `${SQL_DIR}にdump_main_*がありません。先に deno task dump:main を実行してください`,
    );
  }
  // ディレクトリ名の末尾がyymmddhhmmssなので辞書順で最新が取れる
  dirs.sort();
  return `${SQL_DIR}/${dirs.at(-1)}`;
};

const dumpDir = specifiedDir ?? await findLatestDump();

/** テーブルごとのデータファイルを集める */
const dataFiles = new Map<string, string[]>();
for await (const entry of Deno.readDir(dumpDir)) {
  // データファイルは cinelog.<table>.<連番>.sql。スキーマファイルは対象外
  const matched = entry.name.match(/^cinelog\.(\w+)\.\d+\.sql$/);
  if (!matched) continue;
  const files = dataFiles.get(matched[1]) ?? [];
  files.push(`${dumpDir}/${entry.name}`);
  dataFiles.set(matched[1], files.sort());
}

if (dataFiles.size === 0) {
  exit(
    `${dumpDir} にデータファイルがありません。\n` +
      `スキーマのみのdumpの可能性があります（データファイルは.gitignoreで除外されるため、\n` +
      `git cloneしただけの環境には存在しません）。deno task dump:main を実行してください`,
  );
}

const unknown = [...dataFiles.keys()].filter(
  (t) => !INSERT_ORDER.includes(t as typeof INSERT_ORDER[number]),
);
if (unknown.length) {
  exit(`投入順序が定義されていないテーブルがあります: ${unknown.join(", ")}`);
}

/** ファイルからINSERT文だけを取り出す。dump冒頭のバージョン指定コメントは使わない */
const readInserts = async (paths: string[]): Promise<string[]> => {
  const statements: string[] = [];
  for (const path of paths) {
    const sql = await Deno.readTextFile(path);
    // dumpの冒頭にはSET FOREIGN_KEY_CHECKSなどが入るが、HTTPドライバでは
    // セッションが続かず効かない。親→子の順で投入するため、そもそも不要
    for (const chunk of sql.split(/;\s*$/m)) {
      const statement = chunk.trim();
      if (/^INSERT\s+INTO/i.test(statement)) statements.push(statement);
    }
  }
  return statements;
};

console.log(`dump     : ${dumpDir}`);
console.log(`対象     : develop（mainには流せません）`);
for (const table of INSERT_ORDER) {
  const paths = dataFiles.get(table);
  console.log(
    `  ${table.padEnd(20)} ${paths ? `${paths.length}ファイル` : "データなし"}`,
  );
}

if (isDryRun) {
  for (const table of INSERT_ORDER) {
    const paths = dataFiles.get(table);
    if (!paths) continue;
    const inserts = await readInserts(paths);
    const rows = inserts.reduce(
      (sum, s) => sum + (s.match(/\),\s*\(/g)?.length ?? 0) + 1,
      0,
    );
    console.log(`\n${table}: INSERT ${inserts.length}文 / 約${rows}行`);
    console.log(`  ${inserts[0]?.slice(0, 120)}...`);
  }
  console.log("\n--dry-run のため実行していません");
  Deno.exit(0);
}

const username = Deno.env.get("DB_DEV_USERNAME");
const password = Deno.env.get("DB_DEV_PASSWORD");
if (!username || !password) {
  exit(
    "developの接続情報（DB_DEV_USERNAME / DB_DEV_PASSWORD）が.envにありません",
  );
}

const connection = connect({
  host: Deno.env.get("DB_HOST"),
  username,
  password,
  database: "cinelog",
});

const [identity] = await connection.execute(
  "SELECT DATABASE() AS db, CURRENT_USER() AS user",
) as Array<{ db: string; user: string }>;
console.log(`接続先   : ${identity.user} @ ${identity.db}`);

/** 各テーブルの現在の件数を取得する */
const countRows = async () => {
  const counts: Record<string, number> = {};
  for (const table of INSERT_ORDER) {
    const [row] = await connection.execute(
      `SELECT COUNT(*) AS c FROM \`${table}\``,
    ) as Array<{ c: number }>;
    counts[table] = Number(row.c);
  }
  return counts;
};

const before = await countRows();
console.log("\n現在のdevelop:");
for (const [table, count] of Object.entries(before)) {
  console.log(`  ${table.padEnd(20)} ${count}行`);
}

if (!skipsConfirm) {
  const answer = prompt(
    "\ndevelopの既存データをすべて削除してmainのdumpで置き換えます。続けますか？ (yes/no)",
  );
  if (answer !== "yes") {
    console.log("中止しました");
    Deno.exit(0);
  }
}

try {
  console.log("\n既存データを削除:");
  for (const table of DELETE_ORDER) {
    await connection.execute(`DELETE FROM \`${table}\``);
    console.log(`  ${table} を空にしました`);
  }

  console.log("\nmainのデータを投入:");
  for (const table of INSERT_ORDER) {
    const paths = dataFiles.get(table);
    if (!paths) {
      console.log(`  ${table} はデータなし（スキップ）`);
      continue;
    }
    const inserts = await readInserts(paths);
    for (const statement of inserts) await connection.execute(statement);
    console.log(`  ${table} に ${inserts.length}文を投入`);
  }
} catch (error) {
  console.error("\n%c投入中に失敗しました", "color: red");
  console.error(error);
  console.error(
    "\n%cdevelopのデータが中途半端な状態になっている可能性があります。" +
      "もう一度このコマンドを実行すれば全削除からやり直せます",
    "color: yellow",
  );
  Deno.exit(1);
}

const after = await countRows();
console.log("\n投入後のdevelop:");
for (const [table, count] of Object.entries(after)) {
  console.log(`  ${table.padEnd(20)} ${count}行`);
}

// 外部キーの整合性を確認する。移行SQLを流す前提条件になる
const [orphan] = await connection.execute(
  "SELECT COUNT(*) AS c FROM tbl_movieinfo m " +
    "LEFT JOIN tbl_theater t ON m.theater_id = t.id WHERE t.id IS NULL",
) as Array<{ c: number }>;
console.log(`\n参照先の無いtheater_id: ${orphan.c}件`);

if (Number(orphan.c) !== 0) {
  exit("外部キーの整合が取れていません。dumpの内容を確認してください");
}
console.log("%c完了", "color: green");

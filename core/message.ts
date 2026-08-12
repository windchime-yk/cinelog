/** ダッシュボードに表示するエラーメッセージ */
const DASHBOARD_ERROR_MESSAGES = {
  "invalid-title": "タイトルを246文字以内で入力してください",
  "invalid-theater": "鑑賞した映画館を選択してください",
  "invalid-datetime":
    "鑑賞日・上映開始時間・上映終了時間を正しく入力してください",
  "cross-day-mismatch":
    "「日を跨ぐ」のチェックと上映終了時間が一致していません。入力内容を確認してください",
  "invalid-format": "鑑賞形式の選択が不正です",
  "invalid-companion-type": "同伴者分類の選択が不正です",
  "invalid-accompanier": "同伴者数は0以上の整数で入力してください",
  "invalid-rating": "評価は1〜5の整数で入力してください",
  "invalid-name": "名称を246文字以内で入力してください",
  "duplicate-name": "同じ名称がすでに登録されています",
  "insert-failed": "データベースへの登録に失敗しました",
} as const;

/** ダッシュボードのエラーコード */
export type DashboardErrorCode = keyof typeof DASHBOARD_ERROR_MESSAGES;

/**
 * エラーコードから表示用メッセージを取得する
 *
 * URLパラメータには文言ではなくコードを載せる。任意の文言を渡されて
 * サイト発の通知を装われるのを防ぐため、未知のコードはnullにする
 * @param code URLパラメータのエラーコード
 */
export const getDashboardErrorMessage = (
  code: string | null,
): string | null => {
  if (!code) return null;
  return DASHBOARD_ERROR_MESSAGES[code as DashboardErrorCode] ?? null;
};

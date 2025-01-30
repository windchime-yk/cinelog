import { STATUS_CODE } from "$std/http/status.ts";

/**
 * APIコードオプション
 */
export interface ApiCodeOptions {
  /** API名 */
  api?: string;
  /** HTTPメソッド */
  method: string;
  /** ステータスコード */
  status?: typeof STATUS_CODE;
}

/**
 * API共通レスポンス
 */
export interface CommonApiResponse {
  /** レスポンスコード */
  code: string;
  /** レスポンスメッセージ */
  message: string;
}

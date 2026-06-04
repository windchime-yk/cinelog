import { type StatusCode } from "@std/http/status-code";

/**
 * APIコードオプション
 */
export interface ApiCodeOptions {
  /** API名 */
  api?: string;
  /** HTTPメソッド */
  method: string;
  /** ステータスコード */
  status?: StatusCode;
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

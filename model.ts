import { Status } from "$std/http/http_status.ts";

/**
 * APIコードオプション
 */
export interface ApiCodeOptions {
  /** API名 */
  api?: string;
  /** HTTPメソッド */
  method: string;
  /** ステータスコード */
  status?: Status;
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

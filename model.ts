import { StatusCodeNumber } from "./deps.ts";

/**
 * 映画鑑賞情報
 */
export interface MovieInfo {
  /** ID */
  id: string;
  /** 映画タイトル */
  title: string;
  /** 吹替版かどうか */
  is_dubbed?: boolean;
  /** 国内映画かどうか */
  is_domestic?: boolean;
  /** 実写かどうか */
  is_live_action?: boolean;
  /** 鑑賞した映画館 */
  theater: string;
  /** 映画鑑賞日 */
  // view_date: `${string}/${string}/${string}`,
  view_date: string;
  /** 上映開始時間 */
  // view_start_time: `${string}:${string}`,
  view_start_time: string | null;
  /** 上映終了時間 */
  // view_end_time: `${string}:${string}`,
  view_end_time: string | null;
  /** 同伴者数 */
  accompanier?: number;
  /** 5段階評価 */
  rating?: number;
  /** コメント */
  comment?: string;
}

/** SQL断片統合Class宣言のオプション */
export interface CombineSqlOptions {
  /** テーブル名 */
  table: string;
  /** フィールド名（デフォルトは"*"） */
  fields?: Array<keyof MovieInfo>;
  /** 検索条件 */
  where?: string;
  /** 曖昧な検索条件 */
  like?: string | null;
  /** 昇順（asc）か降順（desc）で並べ替える */
  order?: {
    target: keyof MovieInfo;
    sort: "desc" | "asc";
  };
  /** データ出力数 */
  limit?: number;
  /** 追加データ */
  inserts?: Partial<Record<keyof MovieInfo, MovieInfo[keyof MovieInfo]>>;
}

export interface UserParam {
  username: string;
  password: string;
}

/**
 * APIコードオプション
 */
export interface ApiCodeOptions {
  /** API名 */
  api?: string;
  /** HTTPメソッド */
  method: string;
  /** ステータスコード */
  status?: StatusCodeNumber;
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

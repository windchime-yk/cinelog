import { Status } from "$std/http/http_status.ts";

export type Table = "tbl_movieinfo" | "tbl_theater";

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
  /** 上映館テーブルID */
  theater_id: number;
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

/**
 * 上映館情報
 */
export interface TheaterInfo {
  /** ID */
  id?: string;
  /** 鑑賞した上映館 */
  name: string;
}

type Inserts<T> = Partial<Record<keyof T, T[keyof T]>>;

/** SQL断片統合Class宣言のオプション */
export interface CombineSqlOptions<T> {
  /** テーブル名 */
  table: Table;
  /** フィールド名（デフォルトは"*"） */
  fields?: Array<keyof T>;
  /** 検索条件 */
  where?: string;
  /** 曖昧な検索条件 */
  like?: string | null;
  /** 昇順（asc）か降順（desc）で並べ替える */
  order?: {
    target: keyof T;
    sort: "desc" | "asc";
  };
  /** データ出力数 */
  limit?: number;
  /** 追加データ */
  inserts?: Inserts<T> | Array<Inserts<T>>;
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

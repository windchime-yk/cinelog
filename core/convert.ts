/** 日付の形式 */
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
/** 時間の形式 */
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

/**
 * YYYY-MM-DD形式の日付文字列か
 * @param value 検証する値
 */
export const isDateString = (value: string | null): value is string =>
  !!value && DATE_PATTERN.test(value);

/**
 * HH:MMないしHH:MM:SS形式の時間文字列か
 * @param value 検証する値
 */
export const isTimeString = (value: string | null): value is string =>
  !!value && TIME_PATTERN.test(value);

/**
 * 文字列の変換処理
 */
export class Convert {
  /**
   * フォームから取得した文字列をbooleanに変換する
   * @param value フォームから取得した値
   */
  public isFormToDatabase(value: "on" | "null" | string | null): boolean {
    if (value === "on") return true;
    return false;
  }

  /**
   * YYYY-MM-DD形式の日付文字列を検証する
   * @param date 日付
   */
  private normalizeDate(date: string | null): string {
    if (!isDateString(date)) {
      throw new RangeError(`日付の形式が不正です: ${date}`);
    }

    // 2023-02-30のような存在しない日付をDateの繰り上げに任せず弾く
    const parsed = new Date(`${date}T00:00:00Z`);
    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== date
    ) {
      throw new RangeError(`存在しない日付です: ${date}`);
    }

    return date;
  }

  /**
   * HH:MMないしHH:MM:SS形式の時間文字列をHH:MM:SSに揃える
   * @param time 時間
   */
  private normalizeTime(time: string | null): string {
    if (!isTimeString(time)) {
      throw new RangeError(`時間の形式が不正です: ${time}`);
    }

    return time.length === 5 ? `${time}:00` : time;
  }

  /**
   * 日付と時間を結合してMySQLのDATETIME形式(YYYY-MM-DD HH:MM:SS)にする
   * @param date 日付
   * @param time 時間
   */
  public formatDatetime(date: string | null, time: string | null): string {
    return `${this.normalizeDate(date)} ${this.normalizeTime(time)}`;
  }

  /**
   * 日付に日数を加算する。実行環境のタイムゾーンに影響されないようUTCで計算する
   * @param date 日付
   * @param days 加算する日数
   */
  public addDays(date: string | null, days: number): string {
    const added = new Date(`${this.normalizeDate(date)}T00:00:00Z`);
    added.setUTCDate(added.getUTCDate() + days);

    return added.toISOString().slice(0, 10);
  }

  /**
   * 上映終了時間が上映開始時間より前なら、日を跨いだ鑑賞と判定する
   *
   * 開始と終了が同時刻の場合は日を跨いだ扱いにしない。Googleカレンダーの
   * 終日予定から取り込んだ00:00→00:00が「時刻不明」を意味しており、
   * 翌日に繰り上げると上映時間0分（=「不明」表示）が1440分になってしまうため
   * @param startTime 上映開始時間
   * @param endTime 上映終了時間
   */
  public isCrossDay(startTime: string | null, endTime: string | null): boolean {
    // HH:MM:SSに揃えた固定幅の文字列同士なら、辞書順比較が時系列比較と一致する
    return this.normalizeTime(endTime) < this.normalizeTime(startTime);
  }
}

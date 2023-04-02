/**
 * 文字列の変換処理
 */
export class Convert {
  /**
   * 文字列にシングルクォートを挿入する
   * @param value DBやフォームから取得した値
   */
  public insertSingleQuote(value: string | number | boolean | null): string {
    if (
      typeof value === "number" || typeof value === "boolean" ||
      value === "true" || value === "false" ||
      typeof value === "string" && value.match(/^[1-99]$/) ||
      value === "null" ||
      value === null
    ) return `${value}`;
    return `'${value}'`;
  }

  /**
   * フォームから取得した文字列をbooleanに変換する
   * @param value フォームから取得した値
   */
  public isFormToDatabase(value: "on" | "null" | string | null): boolean {
    if (value === "on") return true;
    return false;
  }

  /**
   * nullに該当する文字列をnullに変換する
   * @param value DBやフォームから取得した値
   */
  public nullish(value: string | number | boolean | null) {
    if (value === "") return null;
    return value;
  }
}

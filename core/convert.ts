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
}

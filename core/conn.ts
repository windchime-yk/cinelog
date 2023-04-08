// @deno-types="https://esm.sh/@planetscale/database@1.5.0/dist/index.d.ts"
import { connect, type Connection } from "ps";
import { config } from "../config.ts";

/**
 * PlanetScaleとの接続処理
 */
export class Conn {
  private conn: Connection;

  constructor() {
    this.conn = connect({
      host: config.ps_host,
      username: config.ps_username,
      password: config.ps_password,
    });
  }

  /**
   * PlanetScaleにSQLを送信する
   */
  public async execute<T>(sql: string): Promise<T[]> {
    const result = await this.conn.execute(sql);
    return result.rows as T[];
  }
}

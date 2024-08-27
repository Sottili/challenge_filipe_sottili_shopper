import { Pool } from "pg";

export class db {
  private user: string = "admin";
  private password: string = "admin";
  private host: string = "localhost";
  private port: number = 5432;
  private database: string = "challenge_shopper";

  public initialize(): void {
    const pool = new Pool({
      user: this.user,
      password: this.password,
      host: this.host,
      port: this.port,
      database: this.database,
    });
    pool
      .connect()
      .then(() => {
        console.log(`Database Connected!`);
      })
      .catch((e) => {
        throw new Error(e);
      });
  }
}

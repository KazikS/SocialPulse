import { Database } from "better-sqlite3";
import { getDatabase } from "../connection";

export class BaseRepository<T> {
  constructor(protected tableName: string) {}

  private get database() {
    return getDatabase();
  }

  findAll(): T[] {
    const sql = `SELECT * FROM ${this.tableName}`;
    return this.database.prepare(sql).all() as T[];
  }

  findById(id: number): T | undefined {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    return this.database.prepare(sql).get(id) as T | undefined;
  }

  deleteById(id: number) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    return this.database.prepare(sql).run(id);
  }

  create(data: Omit<T, "id">) {
    const keys = Object.keys(data as Record<string, unknown>);
    const values = Object.values(data as Record<string, unknown>);
    const sql = `INSERT INTO ${this.tableName} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`;
    return this.database.prepare(sql).run(...values);
  }
}

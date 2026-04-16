import { Database } from "better-sqlite3";
import { getDatabase } from "../connection";

export class BaseRepository<T> {
  constructor(protected tableName: string) {}

  protected get database() {
    return getDatabase();
  }

  private buildInsert(data: Omit<T, "id">, modifier = "") {
    const keys = Object.keys(data as Record<string, unknown>);
    const values = Object.values(data as Record<string, unknown>);
    return {
      sql: `INSERT ${modifier} INTO ${this.tableName} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
      values,
    };
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
    const { sql, values } = this.buildInsert(data);
    return this.database.prepare(sql).run(...values);
  }

  createOrIgnore(data: Omit<T, "id">) {
    const { sql, values } = this.buildInsert(data, "OR IGNORE");
    return this.database.prepare(sql).run(...values);
  }

  /**
   * Вставляет запись в указанную таблицу.
   * Используется для работы со связанными таблицами (post_media, post_stats и т.д.)
   *
   * @param table — имя таблицы
   * @param data — объект с полями для вставки
   */
  protected insertTo(table: string, data: Record<string, unknown>) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const sql = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`;
    return this.database.prepare(sql).run(...values);
  }

  /**
   * Получает все записи из таблицы по значению конкретного поля.
   * Например: все медиа поста, все комментарии поста.
   *
   * @param table — имя таблицы
   * @param field — имя поля для фильтрации
   * @param value — значение для поиска
   * @returns массив найденных записей типа R
   */
  protected getFrom<R>(table: string, field: string, value: unknown): R[] {
    const sql = `SELECT * FROM ${table} WHERE ${field} = ?`;
    return this.database.prepare(sql).all(value) as R[];
  }
}

import Database from "better-sqlite3";
import { app } from "electron";
import path from "path";

let db: Database.Database | null = null;

export const initDatabase = () => {
  const dbPath = app.getPath("userData");
  db = new Database(path.join(dbPath, "social_pulse.db"));
  return db;
};

export const getDatabase = () => {
  if (!db) throw new Error("Database not initialized");
  return db;
};

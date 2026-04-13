import { getDatabase } from "@main/database/connection";
import { ipcMain } from "electron";

const initDb = ipcMain.handle("test_db", () => {
  const sql = `SELECT name FROM sqlite_master WHERE type='table'`;
  return getDatabase().prepare(sql).all();
});

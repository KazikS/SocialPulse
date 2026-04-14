import { getDatabase } from "@main/database/connection";
import { ipcMain } from "electron";

ipcMain.handle("db:test", () => {
  const sql = `SELECT name FROM sqlite_master WHERE type='table'`;
  return getDatabase().prepare(sql).all();
});

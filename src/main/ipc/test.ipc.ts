import { ipcMain } from "electron";
import { getDatabase } from "../database/connection";

export const pingPongHandle = ipcMain.handle("ping", () => {
  return "pong";
});

export const testDB = ipcMain.handle("test_db", () => {
  const sql = `SELECT name FROM sqlite_master WHERE type='table'`;
  return getDatabase().prepare(sql).all();
});

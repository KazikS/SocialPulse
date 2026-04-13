import { ipcMain } from "electron";
import { getDatabase } from "../database/connection";

const pingPongHandle = ipcMain.handle("ping", () => {
  return "pong";
});

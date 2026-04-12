import { ipcMain } from "electron";

export const pingPongHandle = ipcMain.handle("ping", () => {
  return "pong";
});

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  platforms: {
    getAll: () => ipcRenderer.invoke("platforms:getAll"),
    create: (data: Record<string, unknown>) =>
      ipcRenderer.invoke("platforms:create", data),
    getById: (id: number) => ipcRenderer.invoke("platforms:getById", id),
    deleteById: (id: number) => ipcRenderer.invoke("platforms:deleteById", id),
  },
});

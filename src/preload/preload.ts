import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  platforms: {
    getAll: () => ipcRenderer.invoke("platforms:getAll"),
    create: (data: Record<string, unknown>) =>
      ipcRenderer.invoke("platforms:create", data),
    getById: (id: number) => ipcRenderer.invoke("platforms:getById", id),
    deleteById: (id: number) => ipcRenderer.invoke("platforms:deleteById", id),
    getOverview: () => ipcRenderer.invoke("platforms:getOverview"),
  },
  posts: {
    getAll: () => ipcRenderer.invoke("posts:getAll"),
    create: (data: Record<string, unknown>) =>
      ipcRenderer.invoke("posts:create", data),
    getById: (id: number) => ipcRenderer.invoke("posts:getById", id),
    deleteById: (id: number) => ipcRenderer.invoke("posts:deleteById", id),
    addMedia: (data: Record<string, unknown>) =>
      ipcRenderer.invoke("posts:addMedia", data),
    getMedia: (postId: number) => ipcRenderer.invoke("posts:getMedia", postId),
    addComment: (data: Record<string, unknown>) =>
      ipcRenderer.invoke("posts:addComment", data),
    getComments: (postId: number) =>
      ipcRenderer.invoke("posts:getComments", postId),
    getStats: (postId: number) => ipcRenderer.invoke("posts:getStats", postId),
    addStats: (data: Record<string, unknown>) =>
      ipcRenderer.invoke("posts:addStats", data),
    getAllByDate: (date: string) =>
      ipcRenderer.invoke("posts:getAllByDate", date),
  },
  sources: {
    getAll: () => ipcRenderer.invoke("sources:getAll"),
    create: (data: Record<string, unknown>) =>
      ipcRenderer.invoke("sources:create", data),
    getById: (id: number) => ipcRenderer.invoke("sources:getById", id),
    deleteById: (id: number) => ipcRenderer.invoke("sources:deleteById", id),
    getStats: (sourceId: number) =>
      ipcRenderer.invoke("sources:getStats", sourceId),
    addStats: (data: Record<string, unknown>) =>
      ipcRenderer.invoke("sources:addStats", data),
  },
  db: {
    test: () => ipcRenderer.invoke("db:test"),
  },
});

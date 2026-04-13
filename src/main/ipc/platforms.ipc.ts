import { PlatformsRepository } from "@main/database/repositories";
import { Platform } from "@shared/types/entites";
import { ipcMain, IpcMainInvokeEvent } from "electron";

let repo: PlatformsRepository;

//ленивая инициализация чтобы не было ошибки при инициализаии базы данных
const getRepo = () => {
  if (!repo) {
    repo = new PlatformsRepository();
  }
  return repo;
};

const handleCreate = (_event: IpcMainInvokeEvent, data: Platform) => {
  return getRepo().create(data);
};
const handleGetById = (_event: IpcMainInvokeEvent, id: number) => {
  return getRepo().findById(id);
};
const handleDeleteById = (_event: IpcMainInvokeEvent, id: number) => {
  return getRepo().deleteById(id);
};

const getAll = ipcMain.handle("platforms:getAll", () => {
  return getRepo().findAll();
});
const create = ipcMain.handle("platforms:create", handleCreate);
const getById = ipcMain.handle("platforms:getById", handleGetById);
const deleteById = ipcMain.handle("platforms:deleteById", handleDeleteById);

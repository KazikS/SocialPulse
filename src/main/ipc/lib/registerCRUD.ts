import { BaseRepository } from "@main/database/repositories";
import { ipcMain, IpcMainInvokeEvent } from "electron";

export const registerCRUD = <T>(name: string, repo: BaseRepository<T>) => {
  ipcMain.handle(`${name}:getAll`, () => {
    return repo.findAll();
  });

  ipcMain.handle(
    `${name}:create`,
    (_event: IpcMainInvokeEvent, data: Omit<T, "id">) => {
      return repo.create(data);
    },
  );

  ipcMain.handle(
    `${name}:getById`,
    (_event: IpcMainInvokeEvent, id: number) => {
      return repo.findById(id);
    },
  );

  ipcMain.handle(
    `${name}:deleteById`,
    (_event: IpcMainInvokeEvent, id: number) => {
      return repo.deleteById(id);
    },
  );
};

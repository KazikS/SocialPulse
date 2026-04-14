import { BaseRepository } from "@main/database/repositories";
import { ipcMain, IpcMainInvokeEvent } from "electron";

export const registerCRUD = <T>(
  name: string,
  createRepo: () => BaseRepository<T>,
) => {
  let repo: BaseRepository<T>;
  const getRepo = () => {
    if (!repo) repo = createRepo();
    return repo;
  };

  ipcMain.handle(`${name}:getAll`, () => {
    return getRepo().findAll();
  });

  ipcMain.handle(
    `${name}:create`,
    (_event: IpcMainInvokeEvent, data: Omit<T, "id">) => {
      return getRepo().create(data);
    },
  );

  ipcMain.handle(
    `${name}:getById`,
    (_event: IpcMainInvokeEvent, id: number) => {
      return getRepo().findById(id);
    },
  );

  ipcMain.handle(
    `${name}:deleteById`,
    (_event: IpcMainInvokeEvent, id: number) => {
      return getRepo().deleteById(id);
    },
  );
};

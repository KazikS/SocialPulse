import { SourcesRepository } from "@main/database/repositories";
import { Source, SourceStats } from "@shared/types/entites";
import { ipcMain, IpcMainInvokeEvent } from "electron";
import { registerCRUD } from "./lib/registerCRUD";

let repo: SourcesRepository;

const getRepo = () => {
  if (!repo) {
    repo = new SourcesRepository();
  }
  return repo;
};

registerCRUD("sources", () => new SourcesRepository());

// Stats
ipcMain.handle(
  "sources:addStats",
  (_event: IpcMainInvokeEvent, data: Omit<SourceStats, "id">) => {
    return getRepo().addStats(data);
  },
);
ipcMain.handle(
  "sources:getStats",
  (_event: IpcMainInvokeEvent, sourceId: number) => {
    return getRepo().getStats(sourceId);
  },
);

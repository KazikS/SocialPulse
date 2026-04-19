import { PlatformsRepository } from "@main/database/repositories";
import { ipcMain } from "electron";

import { registerCRUD } from "./lib/registerCRUD";

let repo: PlatformsRepository;

const getRepo = () => {
  if (!repo) {
    repo = new PlatformsRepository();
  }
  return repo;
};

registerCRUD("platforms", getRepo);

ipcMain.handle("platforms:getOverview", () => getRepo().getOverview());

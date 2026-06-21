import { platformRepo } from "@main/database/repositories";
import { ipcMain } from "electron";

import { registerCRUD } from "./lib/registerCRUD";

registerCRUD("platforms", platformRepo);

ipcMain.handle("platforms:getOverview", () => platformRepo.getOverview());

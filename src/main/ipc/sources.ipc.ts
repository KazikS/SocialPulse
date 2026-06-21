import { sourceRepo } from "@main/database/repositories";
import { uploadFile } from "@main/services/source.service";
import { PlatformSlug, SourceStats } from "@shared/types/entites";
import { ipcMain, IpcMainInvokeEvent } from "electron";

import { registerCRUD } from "./lib/registerCRUD";

type UploadIconType = {
  platform: PlatformSlug;
  source_id: number;
  u8a: Uint8Array;
};

registerCRUD("sources", sourceRepo);

// Stats
ipcMain.handle(
  "sources:addStats",
  (_event: IpcMainInvokeEvent, data: Omit<SourceStats, "id">) => {
    return sourceRepo.addStats(data);
  },
);
ipcMain.handle(
  "sources:getStats",
  (_event: IpcMainInvokeEvent, sourceId: number) => {
    return sourceRepo.getStats(sourceId);
  },
);

ipcMain.handle(
  "sources:addIcon",
  (_event: IpcMainInvokeEvent, data: UploadIconType) => {
    return uploadFile({
      platform: data.platform,
      u8a: data.u8a,
      sourceId: data.source_id,
    });
  },
);

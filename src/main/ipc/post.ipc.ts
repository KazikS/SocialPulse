import { postRepo } from "@main/database/repositories";
import { PostComment, PostMedia, PostStats } from "@shared/types/entites";
import { ipcMain, IpcMainInvokeEvent } from "electron";

import { registerCRUD } from "./lib/registerCRUD";

registerCRUD("posts", postRepo);

const handleAddMedia = (
  _event: IpcMainInvokeEvent,
  data: Omit<PostMedia, "id">,
) => {
  return postRepo.addMedia(data);
};

const handleGetMedia = (_event: IpcMainInvokeEvent, postId: number) => {
  return postRepo.getMedia(postId);
};

const handleAddComment = (
  _event: IpcMainInvokeEvent,
  data: Omit<PostComment, "id">,
) => {
  return postRepo.addComment(data);
};

const handleGetComments = (_event: IpcMainInvokeEvent, postId: number) => {
  return postRepo.getComment(postId);
};

const handleAddStats = (
  _event: IpcMainInvokeEvent,
  data: Omit<PostStats, "id">,
) => {
  return postRepo.addStats(data);
};

const handleGetStats = (_event: IpcMainInvokeEvent, postId: number) => {
  return postRepo.getStats(postId);
};

const handleGetAllByDate = (_event: IpcMainInvokeEvent, date: string) => {
  return postRepo.getAllByDate(date);
};

const handleGetInRange = (
  _event: IpcMainInvokeEvent,
  start: string,
  end: string,
) => {
  return postRepo.getInRange(start, end);
};

ipcMain.handle("posts:addMedia", handleAddMedia);
ipcMain.handle("posts:getMedia", handleGetMedia);
ipcMain.handle("posts:addComment", handleAddComment);
ipcMain.handle("posts:getComments", handleGetComments);
ipcMain.handle("posts:getStats", handleGetStats);
ipcMain.handle("posts:addStats", handleAddStats);
ipcMain.handle("posts:getAllByDate", handleGetAllByDate);
ipcMain.handle("posts:getInRange", handleGetInRange);

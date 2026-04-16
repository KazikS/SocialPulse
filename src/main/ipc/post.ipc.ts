import { PostRepository } from "@main/database/repositories";
import { PostComment, PostMedia, PostStats } from "@shared/types/entites";
import { ipcMain, IpcMainInvokeEvent } from "electron";

import { registerCRUD } from "./lib/registerCRUD";

let repo: PostRepository;

const getRepo = () => {
  if (!repo) {
    repo = new PostRepository();
  }
  return repo;
};

registerCRUD("posts", () => new PostRepository());

const handleAddMedia = (
  _event: IpcMainInvokeEvent,
  data: Omit<PostMedia, "id">,
) => {
  return getRepo().addMedia(data);
};
const handleGetMedia = (_event: IpcMainInvokeEvent, postId: number) => {
  return getRepo().getMedia(postId);
};
const handleAddComment = (
  _event: IpcMainInvokeEvent,
  data: Omit<PostComment, "id">,
) => {
  return getRepo().addComment(data);
};
const handleGetComments = (_event: IpcMainInvokeEvent, postId: number) => {
  return getRepo().getComment(postId);
};
const handleAddStats = (
  _event: IpcMainInvokeEvent,
  data: Omit<PostStats, "id">,
) => {
  return getRepo().addStats(data);
};
const handleGetStats = (_event: IpcMainInvokeEvent, postId: number) => {
  return getRepo().getStats(postId);
};

ipcMain.handle("posts:addMedia", handleAddMedia);
ipcMain.handle("posts:getMedia", handleGetMedia);
ipcMain.handle("posts:addComment", handleAddComment);
ipcMain.handle("posts:getComments", handleGetComments);
ipcMain.handle("posts:getStats", handleGetStats);
ipcMain.handle("posts:addStats", handleAddStats);

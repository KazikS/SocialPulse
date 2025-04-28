require("dotenv").config();

const { app, BrowserWindow, ipcMain } = require("electron");

const {
  getVkGroupID,
  getVkPosts,
  analyzeVkPosts,
  cancelRequest,
} = require("./services/vk");

const path = require("node:path");

const { createClient } = require("./services/tg");

const {
  initDB,
  insertOrUpdatePost,
  getPosts,
  deletePostsByIds,
  getStatistics,
} = require("./db/db");

initDB();

if (require("electron-squirrel-startup")) {
  app.quit();
}


const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//VK
ipcMain.handle("vk:getGroupID", async (event, url) => {
  const meta = await getVkGroupID(url);
  console.log(JSON.stringify(meta, null, 2));
  return meta;
});

ipcMain.handle(
  "vk:getPosts",
  async (event, { groupId, dateFrom, dateTo, title, link }) => {
    const posts = await getVkPosts({ groupId, dateFrom, dateTo });

    const channelInfo = {
      platform: "vk",
      external_id: groupId.toString(),
      title,
      link,
    };

    for (const post of posts) {
      insertOrUpdatePost(
        {
          id: `vk_${groupId}_${post.id}`,
          text: post.text || "",
          date: new Date(post.date * 1000).toISOString(),
          views: post.views?.count || 0,
          likes: post.likes?.count || 0,
          comments: post.comments?.count || 0,
          reposts: post.reposts?.count || 0,
        },
        "vk",
        channelInfo
      );
    }
    return posts;
  }
);

ipcMain.handle("vk:analyze", async (event, posts) => {
  return analyzeVkPosts(posts);
});

ipcMain.handle("vk:cancelAnalyze", () => {
  cancelRequest();
});

//Database
ipcMain.handle("db:get-posts", async (event, { from, to }) => {
  return new Promise((resolve) => {
    getPosts(from, to, (data) => resolve(data));
  });
});

ipcMain.handle("db:delete-posts", async (event, ids) => {
  deletePostsByIds(ids);
});

ipcMain.handle("db:get-statistics", async (event, { from, to }) => {
  return new Promise((resolve) => {
    getStatistics(from, to, (stats) => resolve(stats));
  });
});

//TG

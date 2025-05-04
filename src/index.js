require("dotenv").config();
const {app, BrowserWindow, ipcMain} = require("electron");
const {
    getVkGroupID,
    getVkPosts,
    analyzeVkPosts,
    cancelRequest,
} = require("./services/vk");
const path = require("node:path");
const fs = require("fs");
const {
    initDB,
    insertOrUpdatePost,
    getPosts,
    deletePostsByIds,
    getStatistics,
    getChannelIdByExternalId,
} = require("./db/db");
const {
    getClient,
    getChannelInfo,
    getTgPosts,
    analyzeTgPosts,
} = require("./services/tg");
const {scrape, getSiteName} = require("./services/webscrapping");
const dayjs = require("dayjs");

initDB();

if (require("electron-squirrel-startup")) {
    app.quit();
}

let win;
let client = getClient().client;

const createWindow = () => {
    win = new BrowserWindow({
        width: 1000,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    win.loadFile(path.join(__dirname, "index.html"));
    win.webContents.openDevTools();
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
    async (event, {groupId, dateFrom, dateTo, title, link}) => {
        const posts = await getVkPosts({groupId, dateFrom, dateTo});

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
ipcMain.handle("db:get-posts", async (event, {from, to}) => {
    return new Promise((resolve) => {
        getPosts(from, to, (data) => resolve(data));
    });
});

ipcMain.handle("db:delete-posts", async (event, ids) => {
    deletePostsByIds(ids);
});

ipcMain.handle("db:get-statistics", async (event, {from, to, channelId}) => {
    return new Promise((resolve) => {
        getStatistics(from, to, channelId, (stats) => resolve(stats));
    });
});

ipcMain.handle("db:get-channel-id", async (event, externalId) => {
    return new Promise((resolve) => {
        getChannelIdByExternalId(externalId.toString(), (id) => resolve(id));
    });
});

//TG
let phonePromiseResolve;
let codePromiseResolve;
let passwordPromiseResolve;

ipcMain.on("phoneNumber", (event, phone) => {
    if (phonePromiseResolve) {
        phonePromiseResolve(phone);
    }
});

ipcMain.on("phoneCode", (event, code) => {
    if (codePromiseResolve) {
        codePromiseResolve(code);
    }
});

ipcMain.on("password", (event, password) => {
    if (passwordPromiseResolve) {
        passwordPromiseResolve(password);
    }
});

ipcMain.on("startTelegramAuth", async () => {
    try {
        await client.start({
            phoneNumber: async () => {
                return new Promise((resolve) => {
                    phonePromiseResolve = resolve;
                });
            },
            phoneCode: async () => {
                win.webContents.send("askCode");
                return new Promise((resolve) => {
                    codePromiseResolve = resolve;
                });
            },
            password: async () => {
                win.webContents.send("askPassword");
                return new Promise((resolve) => {
                    passwordPromiseResolve = resolve;
                });
            },
            onError: (err) => {
                console.error("Auth error:", err);
                win.webContents.send("authError", err.message || "Unknown error");
            },
        });

        console.log("Telegram connected.");
        fs.writeFileSync(getClient().SESSION_FILE, client.session.save(), "utf-8");
        await client.sendMessage("me", {message: "Hello from Electron UI!"});

        win.webContents.send("authSuccess"); // уведомление об успешной авторизации
    } catch (err) {
        console.error("Telegram auth failed:", err);
        win.webContents.send(
            "authError",
            err.message || "Unknown error during login"
        );
    }
});

ipcMain.handle("tg:getChannelInfo", async (event, url) => {
    const meta = await getChannelInfo(url);
    console.log(JSON.stringify(meta, null, 2));
    return meta;
});

ipcMain.handle(
    "tg:getTgPosts",
    async (
        event,
        {channelid, channelHash, dateFromTG, dateToTG, title, link}
    ) => {
        const posts = await getTgPosts(
            channelid,
            channelHash,
            dateFromTG,
            dateToTG
        );

        const channelInfo = {
            platform: "tg",
            external_id: channelid.toString(),
            title,
            link,
        };

        for (const post of posts) {
            let totalPostTgLikes = 0;
            if (post.reactions) {
                post.reactions.results.forEach((element) => {
                    totalPostTgLikes += element.count;
                });
            }
            insertOrUpdatePost(
                {
                    id: `tg_${channelid}_${post.id}`,
                    text: post.message || "",
                    date: new Date(post.date * 1000).toISOString(),
                    views: post.views || 0,
                    likes: totalPostTgLikes || 0,
                    comments: 0,
                    reposts: 0,
                },
                "tg",
                channelInfo
            );
        }

        return posts;
    }
);

ipcMain.handle("tg:analyze", async (event, posts) => {
    return analyzeTgPosts(posts);
});


ipcMain.handle(
    "web:scrape",
    async (event, {url, dateFromWeb, dateToWeb}) => {
        if (!dayjs(dateFromWeb).isValid() || !dayjs(dateToWeb).isValid()) {
            throw new Error("Некорректный формат даты");
        }

        const posts = await scrape(url, dateFromWeb, dateToWeb);

        // Логирование для дебага
        console.log('Found posts:', posts.length);
        if (posts.length > 0) {
            console.log('Post`s example:', {
                title: "Here is text example",
                link: posts[0].link,
                date: posts[0].date
            });
        }

        const originalUrl = new URL(url);
        const domain = new URL(posts[0].link).hostname;

        const channelInfo = {
            platform: "web",
            external_id: domain.toString(),
            title: await getSiteName(url),
            link: url
        };

        for (const post of posts) {
            const postIdum = new URL(post.link).pathname.split("/").pop();
            insertOrUpdatePost(
                {
                    id: `web_${domain}_${postIdum}`,
                    text: post.title,
                    date: new Date(post.date * 1000).toISOString(),
                    views: 0,
                    likes: 0,
                    comments: 0,
                    reposts: 0,
                },
                "web",
                channelInfo
            );
            console.log(`post added: ${postIdum}`);
        }

        return posts;
    }
);

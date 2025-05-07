const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const fs = require("fs");
const path = require("path");

const apiId = process.env.TG_API_ID ||29974513;
const apiHash = process.env.TG_API_HASH || "0f843f086acdbf04af970bf4ab305768";
let savedSession = "";
let SESSION_FILE;
function setSessionFilePath(app) {
  SESSION_FILE = path.join(app.getPath("userData"), "telegram.session");
  if (fs.existsSync(SESSION_FILE)) {
    savedSession = fs.readFileSync(SESSION_FILE, "utf-8");
  }
}

const stringSession = new StringSession(savedSession);

const client = new TelegramClient(stringSession, parseInt(apiId), apiHash, {
  reconnectRetries: 5,
});

function getClient() {
  
  return { client, SESSION_FILE };
}

function extractChannelUsername(url) {
  const regex = /(?:https?:\/\/)?(?:t\.me|telegram\.me)\/([a-zA-Z0-9_]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function getChannelInfo(url) {
  const username = extractChannelUsername(url);
  try {
    const channelInfo = await client.invoke(
      new Api.contacts.ResolveUsername({
        username,
      })
    );
    let channelid = channelInfo.chats[0].id.toString();
    let channelHash = channelInfo.chats[0].accessHash.toString();
    let channelTitle = channelInfo.chats[0].title;

    return { channelid, channelHash, channelTitle, url };
  } catch (error) {
    console.error(`Error ${error}`);
  }
}

async function getTgPosts(channelId, channelHash, dateFrom, dateTo) {
  let hasMorePosts = true;
  let offsetId = 0;
  let allMessages = [];
  console.log(channelId, channelHash);
  try {
    while (hasMorePosts) {
      const result = await client.invoke(
        new Api.messages.GetHistory({
          peer: new Api.InputPeerChannel({
            channelId: BigInt(channelId),
            accessHash: BigInt(channelHash),
          }),
          maxId: 0,
          minId: 0,
          offsetId: offsetId,
          offsetDate: Math.floor(
            new Date(dateTo).setHours(23, 59, 59, 999) / 1000
          ),
          addOffset: 0,
          limit: 100,
          hash: 0,
        })
      );
      if (result.messages.length === 0) {
        console.log("No more messages");
        hasMorePosts = false;
      } else {
        const fetchedMessages = result.messages.filter(
          (msg) =>
            msg.date >=
            Math.floor(new Date(dateFrom).setHours(0, 0, 0, 0) / 1000)
        );

        allMessages = allMessages.concat(fetchedMessages);

        offsetId = result.messages[result.messages.length - 1].id;
        if (result.messages[result.messages.length - 1].date < dateFrom) {
          hasMorePosts = false;
        }
      }
    }

    const uniqueMap = new Map();
    for (const msg of allMessages) {
      const key = (msg.groupedId || msg.id).toString();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, msg);
      }
    }
    const uniqueMessages = Array.from(uniqueMap.values());
    console.log(uniqueMap.length);
    return uniqueMessages;
  } catch (error) {
    if (error.error_code === 420) {
      const waitTime =
        parseInt(error.error_message.split("_").pop(), 10) * 1000;
      console.log(`Flood wait detected, waiting for ${waitTime} ms`);
    } else {
      console.error(`Error ${error}`);
    }
  }
}

function analyzeTgPosts(posts) {
  if (!Array.isArray(posts) || posts.length === 0)
    return {
      totalLikes: 0,
      totalComments: 0,
      totalViews: 0,
    };

  let numberPosts = posts.length;
  let totalLikes = 0;
  let totalViews = 0;

  for (const post of posts) {
    if (post.reactions) {
      post.reactions.results.forEach((element) => {
        totalLikes += element.count;
      });
    }
    totalViews += post.views;
  }
  console.log(totalLikes, totalViews);
  return { totalLikes, totalViews };
}

module.exports = {
  getClient,
  getChannelInfo,
  getTgPosts,
  analyzeTgPosts,
  setSessionFilePath,
};

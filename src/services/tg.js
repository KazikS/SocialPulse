const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const fs = require("fs");
const path = require("path");

const apiId = parseInt(process.env.TG_API_ID);
const apiHash = process.env.TG_API_HASH;
let savedSession = "";
const SESSION_FILE = path.resolve(__dirname, "telegram.session");
if (fs.existsSync(SESSION_FILE)) {
  savedSession = fs.readFileSync(SESSION_FILE, "utf-8");
}
const stringSession = new StringSession(savedSession);

const client = new TelegramClient(stringSession, apiId, apiHash, {
  reconnectRetries: 5,
});

function getClient() {
  return {
    client,
    SESSION_FILE,
  };
}

function extractChannelUsername(url) {
  const regex = /(?:https?:\/\/)?(?:t\.me|telegram\.me)\/([a-zA-Z0-9_]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function getChannelInfo(username) {
  try {
    const channelInfo = await client.invoke(
      new Api.contacts.ResolveUsername({
        username,
      })
    );
    let channelid = channelInfo.chats[0].id;
    let channelHash = channelInfo.chats[0].accessHash;
    return { channelid, channelHash };
  } catch (error) {
    console.error(`Error ${error}`);
  }
}

async function getTgPosts(channelId, channelHash, dateFrom, dateTo) {
  let hasMorePosts = true;
  let offsetId = 0;
  let allMessages = [];
  while (hasMorePosts) {
    try {
      const result = client.invoke(
        new Api.messages.GetHistory({
          peer: {
            _: "inputPeerChannel",
            channel_id: channelId,
            access_hash: channelHash,
          },
          maxId: 0,
          minId: 0,
          offsetId: offsetId,
          offsetDate: dateTo,
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
          (msg) => msg.date >= dateFrom
        );
        const uniqueMessagesMap = new Map();

        for (const msg of fetchedMessages) {
          const key = msg.grouped_id || msg.id;

          if (!uniqueMessagesMap.has(key)) {
            uniqueMessagesMap.set(key, msg);
          }
        }

        // Добавляем только уникальные сообщения
        allMessages = allMessages.concat(
          Array.from(uniqueMessagesMap.values())
        );

        offsetId = result.messages[result.messages.length - 1].id;
        if (result.messages[result.messages.length - 1].date < dateFrom) {
          hasMoreMessages = false;
        }
      }
    } catch (error) {
      if (error.error_code === 420) {
        const waitTime =
          parseInt(error.error_message.split("_").pop(), 10) * 1000;
        console.log(`Flood wait detected, waiting for ${waitTime} ms`);
        await delay(waitTime);
      } else {
        console.error(`Error ${error}`);
      }
    }
  }
}

module.exports = {
  getClient,
};

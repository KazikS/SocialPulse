require('dotenv').config();
const apiId = parseInt(process.env.TG_API_ID);
const apiHash = process.env.TG_API_HASH;
const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");

const session = new StringSession(""); // You should put your string session here
const client = new TelegramClient(session, apiId, apiHash, {});

async function auth() {
  console.log("Loading interactive example...");
  await client.start({
    phoneNumber: async () => await input.text("number ?"),
    password: async () => await input.text("password?"),
    phoneCode: async () => await input.text("Code ?"),
    onError: (err) => console.log(err),
  });
 // Save this string to avoid logging in again
  await client.sendMessage("me", { message: "Hello!" });
};

async function run() {
  await client.connect(); // This assumes you have already authenticated with .start()

  const result = await client.invoke(new Api.account.GetPassword({}));
  console.log(result.currentAlgo.salt1 + "\n" + result.currentAlgo.salt2); // prints the result
}

auth().then(run);
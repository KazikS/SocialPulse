const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { computeCheck } = require("telegram/Password.ts");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const apiId = parseInt(process.env.TG_API_ID);
const apiHash = process.env.TG_API_HASH;
const sessionPath = path.resolve(__dirname, "sessionTG.txt");

let stringSession = new StringSession(
  fs.existsSync(sessionPath) ? fs.readFileSync(sessionPath, "utf8") : ""
);

let client = new TelegramClient(stringSession, apiId, apiHash, {
  reconnectRetries: 5,
});

let isAuthorized = false;
async function checkAuth() {
  try {
    await client.connect();
    isAuthorized = await client.isUserAuthorized();
    return isAuthorized;
  } catch (error) {
    console.error(`Error: ${error}`);
    return false;
  }
}

async function sendCode(phoneNumber) {
  if(isAuthorized) return;
  try {
    const response = await client.invoke(
      new Api.auth.SendCode({
        phoneNumber,
        apiId,
        apiHash,
        settings: new Api.CodeSettings({
          allowFlashcall: true,
          allowAppHash: true,
          allowFirebase: true,
          allowMissedCall: true,
        })
      })
    );
    return response.phoneCodeHash;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

async function getPassword() {
  try {
    const response = await client.invoke(new Api.account.GetPassword);
    return response;
  } catch (error) {
    console.error(`Error: ${error}`)
  }
}

async function checkPassword(password) {
  const srpParams = getPassword().currentAlgo;
  const check = computeCheck(password, srpParams);

  const result = await client.invoke(
    new Api.auth.CheckPassword({
      password: new Api.InputCheckPasswordSRP({
        srpId: check.srpId,
        a: check.A,
        m1: check.M1,
      }),
    })
  );

  return result;
}
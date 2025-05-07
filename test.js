const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const fs = require("fs");
const path = require("path");

const apiId = process.env.TG_API_ID || 29974513;
const apiHash = process.env.TG_API_HASH || "0f843f086acdbf04af970bf4ab305768";
let savedSession =
  "1AgAOMTQ5LjE1NC4xNjcuNDEBu6GSX915VMfYVN5vCt6hHFFcDz4ZAGfk9rATx3vUFZ24U8gzAWKz8oShQDJDE8FvB2vLcp1iwcVZu73YqZNLFs/xD2QCFiNGCo+Gww7Li4lOqb7yDNT7A45O18Xv2PMPNslWnDn/vNnhqWy1mE+zqp4eEA3nkhqoBMzAncC72zRgiKYRLrNRDOAfmq4cJ0lA89xB6YNp1WMR4ivz60LO55KxzzfWPtF33qgRTyUJj4UWel43ZwYIhdVU6H/ZlE/3uMQIkIRGUx58zCDCkLEWh3gAdu6T+l6UtU0RIyox5ny2LBb8LBU2MiJ9Ti5NvS6OuS2ohinaHBXcWipiJzlLjzs=";

const stringSession = new StringSession(savedSession);

const client = new TelegramClient(stringSession, parseInt(apiId), apiHash, {
  reconnectRetries: 5,
});

async function check() {
  await client.connect();
  if (await client.checkAuthorization()) {
    console.log("I am logged in!");
  } else {
    console.log(
      "I am connected to telegram servers but not logged in with any account/bot"
    );
  }
}

check();

import fs from "fs";
import fetch from "node-fetch";

const API_URL = "https://www.indiagoldratesapi.com/api/gold-rates";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegram(message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    }),
  });
}

async function run() {
  const res = await fetch(API_URL);
  const apiData = await res.json();

  const price = apiData.gold_rate_24k; // adjust if key differs
  const timestamp = new Date();

  const file = "data/prices.json";
  const json = JSON.parse(fs.readFileSync(file, "utf8"));

  const lastEntry = json.prices.at(-1);
  const lastPrice = lastEntry ? lastEntry.price : null;

  const change = lastPrice !== null ? price - lastPrice : 0;

  json.prices.push({
    timestamp: timestamp.toISOString(),
    price,
    change,
  });

  json.lastUpdated = timestamp.toISOString();
  fs.writeFileSync(file, JSON.stringify(json, null, 2));

  // 🔔 SEND ALERT ONLY IF PRICE CHANGED
  if (change !== 0) {
    const arrow = change > 0 ? "⬆️" : "⬇️";
    const message = `
🪙 *Gold Price Update*
Price: ₹${price}
Change: ${arrow} ${change}
Time: ${timestamp.toLocaleString("en-IN")}
    `.trim();

    await sendTelegram(message);
  }
}

run();

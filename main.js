const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;

// const TOKEN = process.env.TOKEN;

const bot = new TelegramBot(telegramBotToken, { polling: true });

bot.on("message", (msg) => {
  if (msg.entities) {
    bot.sendMessage(msg.chat.id, "PROIBIDO LINK NO GRUPO!");
    bot.deleteMessage(msg.chat.id, msg.message_id);
  }
});

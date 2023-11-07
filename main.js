const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

// const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramBotToken = process.env.token;

const bot = new TelegramBot(telegramBotToken, { polling: true });

bot.on("message", (msg) => {
  let Administradores = [];

  bot.getChatAdministrators(msg.chat.id).then((admin) => {
    admin.map((adm) => {
      Administradores.push(adm.user.id);
    });

    if (Administradores.includes(msg.from.id)) return;
    if (msg?.entities && msg.entities[0].type == "url") {
      bot.sendMessage(msg.chat.id, "PROIBIDO LINKS NO GRUPO!");
      bot.deleteMessage(msg.chat.id, msg.message_id);
    }
  });
});

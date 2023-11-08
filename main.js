const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
//const telegramBotToken = process.env.token;

const bot = new TelegramBot(telegramBotToken, { polling: true });

let Administradores = [];

bot.on("message", async (msg) => {
  try {
    if (msg?.entities && msg.entities[0].type == "url") {
      await GetGroupAdmins(msg);

      if (Administradores.includes(msg.from.id)) return;
      DeleteGroupMessage(msg);
    }

    if ((msg.photo || msg.video) && msg.caption_entities[0].type == "url") {
      DeleteGroupMessage(msg);
    }
  } catch (error) {
    console.log("Erro: " + error.message);
  }
});

//restringir quem manda links
//impedir encaminhamentos
//img com links esta apagando msg do admin

function DeleteGroupMessage(msg) {
  bot.sendMessage(msg.chat.id, "PROIBIDO LINKS NO GRUPO!");
  bot.deleteMessage(msg.chat.id, msg.message_id);
}

function GetGroupAdmins(msg) {
  bot.getChatAdministrators(msg.chat.id).then((admin) => {
    admin.map((adm) => {
      Administradores.push(adm.user.id);
    });
  });
}

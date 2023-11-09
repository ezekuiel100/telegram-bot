const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
//const telegramBotToken = process.env.token;

const bot = new TelegramBot(telegramBotToken, { polling: true });

let Administradores;

bot.on("message", (msg) => {
  Administradores = [];

  if (msg?.entities && msg.entities[0].type == "url") {
    GetGroupAdmins(msg).then(() => {
      DeleteGroupMessage(msg);
    });
  }

  if ((msg.photo || msg.video) && msg.caption_entities[0].type == "url") {
    GetGroupAdmins(msg).then(() => {
      DeleteGroupMessage(msg);
    });
  }
});

function DeleteGroupMessage(msg) {
  console.log(Administradores.includes(msg.from.id));
  console.log(msg);

  if (Administradores.includes(msg.from.id)) return;
  console.log(Administradores);

  bot.sendMessage(msg.chat.id, "PROIBIDO LINKS NO GRUPO!");
  bot.deleteMessage(msg.chat.id, msg.message_id);
  // restrictChatMember(msg);
}

async function GetGroupAdmins(msg) {
  try {
    let admin = await bot.getChatAdministrators(msg.chat.id);
    admin.map((adm) => Administradores.push(adm.user.id));
  } catch (error) {
    console.log("Erro:" + error);
  }
}

function restrictChatMember(msg) {
  bot.restrictChatMember(msg.chat.id, msg.from.id, {
    can_send_messages: false,
  });
}

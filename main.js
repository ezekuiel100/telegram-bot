const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
//const telegramBotToken = process.env.token;

const bot = new TelegramBot(telegramBotToken, { polling: true });

let Administradores;
let linkAlert = "PROIBIDO LINKS NO GRUPO!";
let forwardMessageAlert = "PROIBIDO ENCAMINHA MENSAGEM";

bot.on("message", (msg) => {
  Administradores = [];

  DeleteforwardMessage(msg);

  if (msg?.entities && msg.entities[0].type == "url") {
    GetGroupAdmins(msg).then(() => {
      DeleteGroupMessage(msg, linkAlert);
    });
  }

  if (
    (msg.photo || msg.video) &&
    msg.caption_entities &&
    msg.caption_entities[0]?.type == "url"
  ) {
    GetGroupAdmins(msg).then(() => {
      DeleteGroupMessage(msg, linkAlert);
    });
  }
});

function DeleteGroupMessage(msg, alertText) {
  if (Administradores.includes(msg.from.id) || msg.from.is_bot) return;
  bot.sendMessage(msg.chat.id, alertText);
  bot.deleteMessage(msg.chat.id, msg.message_id);
  restrictChatMember(msg);
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
  let senconds = Math.floor(Date.now() / 1000);

  bot.restrictChatMember(msg.chat.id, msg.from.id, {
    can_send_messages: false,
    until_date: senconds + 100000,
  });
}

function DeleteforwardMessage(msg) {
  if (msg.forward_from_chat) {
    DeleteGroupMessage(msg, forwardMessageAlert);
  }
}

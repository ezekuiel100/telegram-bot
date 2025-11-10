const TelegramBot = require("node-telegram-bot-api");
const Tesseract = require("tesseract.js");
require("dotenv").config();

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
// const telegramBotToken = process.env.token;

const bot = new TelegramBot(telegramBotToken, { polling: true });

let Administradores;
let linkAlert = "PROIBIDO LINKS NO GRUPO!";
let forwardMessageAlert = "PROIBIDO ENCAMINHA MENSAGEM";
let proribitedWords = [
  "cp",
  " cp ",
  "troca cp",
  "Troca cp",
  " Cp ",
  "perv",
  "Troco grupos",
  "Troco Grupos",
  "troco grupos",
  "troco grupo",
  "Troco grupo",
  "incesto",
  "alguem tem grupo",
  "alguem tem grupos",
  "outro grupo",
  "outro grupos",
  "outros grupos",
  "troco link",
  "troco links",
  "novinho enganado",
  "engano hetero",
  "enganei esse",
  "enganei",
  "Enganei esse",
  "Engano hetero",
  "engana hetero",
  "Tenho links",
  "Tenho grupo",
  "Tenho grupos",
  "tenho grupos",
  "tenho grupo",
  "links",
  "Links",
  "criei um grupo",
  "Tenho link",
  "tenho links",
  "tenho link",
  "Troco links",
  "Troco link",
  "conteudo on",
  "Conteudo on",
  "vendo conteudo",
  "Vendo conteudo",
  "tem grupo",
  "Tem grupo",
  "sem limites",
  "sem limite",
  "vendo video",
  "vendo vídeo",
  "mucilon",
  "muci",
  "cambiar",
  "algum grupo",
  "alguem tem grupo",
  "grupo de novinhos",
  "grupo so pra",
  "grupo so para",
  "grupo só para",
  "videos de adolecentes",
  "videos de adolecente",
  "video de adolecente",
  "video de adolescente",
  "videos de adolescentes",
  "videos adolessentes",
  "vídeo adolescente",
  "vídeo adolescentes",
  "vídeos adolescentes",
];

let worker;

(async () => {
  worker = await Tesseract.createWorker("eng");
})();


bot.on("message", (msg) => {
  Administradores = [];
  const chatId = msg.chat.id;
  const messageId = msg.message_id;


  if (msg.new_chat_members) {
    bot.deleteMessage(chatId, messageId).catch((err) => {
      console.error('Erro ao apagar mensagem:', err);
    });
  }

  if (msg.left_chat_member) {
    bot.deleteMessage(chatId, messageId).catch((err) => {
      console.error('Erro ao apagar mensagem de saída:', err);
    });
  }

  DeleteforwardMessage(msg);

  proribitedWords.map((palavra) => {
    if (msg.text?.toLowerCase().includes(palavra)) {
      console.log("msggg")
      DeleteGroupMessage(msg, "MENSAGEM APAGADA!");
    }
  });

  if (msg?.entities && msg.entities[0].type == "url") {
    DeleteGroupMessage(msg, linkAlert);
    return;
  }

  if (
    (msg.photo || msg.video) &&
    msg.caption_entities &&
    msg.caption_entities[0]?.type == "url"
  ) {
    DeleteGroupMessage(msg, linkAlert);
    return;
  }

  containsLettersAndNumbers(msg);
});

function DeleteGroupMessage(msg, alertText) {
  GetGroupAdmins(msg).then(() => {
    if (Administradores.includes(msg.from.id) || msg.from.is_bot) return;

    bot.sendMessage(msg.chat.id, alertText);
    bot.deleteMessage(msg.chat.id, msg.message_id);
    restrictChatMember(msg);
  });
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
    until_date: senconds + 500000,
  });
}

function DeleteforwardMessage(msg) {
  if (msg.forward_from_chat) {
    DeleteGroupMessage(msg, forwardMessageAlert);
  }
}

function containsLettersAndNumbers(msg) {
  if (msg?.text) {
    const res = msg.text.split(" ").map((str) => {
      const hasLetters = /[a-zA-Z]/.test(str);
      const hasNumbers = /[0-9]/.test(str);
      return hasLetters && hasNumbers;
    });

    res.forEach((el) => {
      if (el) {
        DeleteGroupMessage(msg, "Messagem Apagada!!");
      }
    });
  }
}

async function getImage(img, msg) {
  const memory = process.memoryUsage().rss / 1024 / 1024;
  console.log(memory);

  const words = ["cp", "hate", "vendo"];

  const {
    data: { text },
  } = await worker.recognize(img);

  words.forEach((word) => {
    if (text.toLowerCase().includes(word)) {
      console.log(text);
      DeleteGroupMessage(msg, "IMAGEM DELETADA");
    }
  });

  // await worker.terminate();
}

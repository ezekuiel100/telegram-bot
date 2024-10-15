const TelegramBot = require("node-telegram-bot-api");
const Tesseract = require("tesseract.js");
require("dotenv").config();

// const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramBotToken = process.env.token;

const bot = new TelegramBot(telegramBotToken, { polling: true });

let Administradores;
let linkAlert = "PROIBIDO LINKS NO GRUPO!";
let forwardMessageAlert = "PROIBIDO ENCAMINHA MENSAGEM";
let proribitedWords = [
  "troco videos",
  "troco vídeos",
  "troco video",
  "trocar videos",
  "troca videos",
  "troca video",
  "troca vídeo",
  "trocar vídeos",
  "trocar conteudo",
  "troco conteudo",
  "troco conteúdo",
  "trocar video",
  "trocar vídeo",
  "video pra trocar",
  "videos pra trocar",
  "video para trocar",
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
  "ipcam",
  "troco link",
  "troco links",
  "trade",
  "engano hetero",
  "enganei esse",
  "enganei",
  "Enganei esse",
  "Engano hetero",
  "Trade",
  "Tenho links",
  "Tenho grupo",
  "Tenho grupos",
  "tenho grupos",
  "tenho grupo",
  "tr0co",
  "troco",
  "Troco",
  "tr@c@",
  "Tr0co",
  "Tr@c@",
  "Tr0c0",
  "tr0c0",
  "links",
  "Links",
  "criei um grupo",
  "Tenho link",
  "tenho links",
  "tenho link",
  "Troco links",
  "trocar conteúdo",
  "trocar conteudo",
  "Trocar conteudo",
  "Trocar conteúdo",
  "Troco link",
  "conteudo on",
  "Conteudo on",
  "vendo conteudo",
  "Vendo conteudo",
  "tem grupo",
  "Tem grupo",
  "quem quiser",
  "Quem quiser",
  "quem Quiser",
  "sem limites",
  "sem limite",
  "vendo video",
  "vendo vídeo",
  "trc",
  "cambiar",
  "algum grupo",
  "alguem tem grupo",
  "grupo de novinhos",
  "grupo so pra",
  "grupo so para",
  "grupo só para",
];

let worker 

(async () => {
   worker = await Tesseract.createWorker("eng");
})()


bot.on("message", (msg) => {

  Administradores = [];

  if (msg?.photo) {
    const fileId = msg?.photo[2].file_id;
    bot.getFileLink(fileId).then((res) => {
      getImage(res, msg);
    });
  }

  DeleteforwardMessage(msg);
  containsLettersAndNumbers(msg);

  proribitedWords.map((palavra) => {
    if (msg.text?.toLowerCase().includes(palavra)) {
      DeleteGroupMessage(msg, "MENSAGEM APAGADA!");
    }
  });

  if (msg?.entities && msg.entities[0].type == "url") {
    DeleteGroupMessage(msg, linkAlert);
  }

  if (
    (msg.photo || msg.video) &&
    msg.caption_entities &&
    msg.caption_entities[0]?.type == "url"
  ) {
    DeleteGroupMessage(msg, linkAlert);
  }
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
    until_date: senconds + 200000,
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
    
  const memory = process.memoryUsage().rss / 1024 / 1024  
  console.log(memory)

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

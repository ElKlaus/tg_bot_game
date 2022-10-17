
const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');
const token = '5733173682:AAFQIlEM_t0bWvLPf538yURy8Uxvl-TyzHk';


const bot = new TelegramApi(token, {polling:true});

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Cейчас я загадаю цифру от 0 до 9, а ты должен ее угадать`);

  const randomNumber = Math.floor(Math.random() * 10);

  chats[chatId] = randomNumber;

  await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Получить информацию о пользователе'},
    {command: '/game', description: 'Игра: "Угадай цифру"'},
  ])
  
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
  
    if (text == '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/bec/f45/becf45d6-eb16-4fac-bc7a-6007142701c6/192/10.webp');
      return bot.sendMessage(chatId, `Привет от Артема`);
    }
  
    if (text == '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
    }

    if (text == '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз');  
  })

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
    } else {
      bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
    }
  })
}

start();
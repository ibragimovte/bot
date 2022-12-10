const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = "5201813144:AAFWtiqfqYQb5SmVCY0ESJ4EBJr6Jzp1z_E"

const bot = new TelegramApi(token, {polling: true} )

const chats ={}


const startGame = async (chatId) => {
   await bot.sendMessage(chatId, 'Угадай цифру от 0 до 9');
   const randomNumber = Math.floor(Math.random() * 10) 
   chats[chatId] = randomNumber;
   await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
   bot.setMyCommands([
      {command: '/start', description:"Начальное приветствие"},
      {command: '/info', description:"Инфа"},
      {command: '/game', description:"Игра"}
   ])
   
   bot.on('message', async msg => {
       const text = msg.text;
       const chatId = msg.chat.id;
   
         
       if (text === '/start'){
         await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/3.jpg');
         return bot.sendMessage(chatId, 'Добро пожаловать ');
       }
       if (text === '/info'){
         
         return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}  `);
       }
       if (text === '/game'){
         return startGame(chatId);
       }
       return bot.sendMessage(chatId, 'Моя твоя не понимать');
   })

   bot.on('callback_query', async msg =>{
      const data = msg.data;
      const chatId = msg.message.chat.id;
      if (data === '/again') {
         return startGame(chatId)
      }
      if (data === chats[chatId]) {
         return await bot.sendMessage(chatId, `Молодец, ты угадал цифру ${chats[chatId]}`, againOptions)
      } else { 
         return await bot.sendMessage(chatId, `Плохо, ты не угадал цифру ${chats[chatId]}`, againOptions)
      }
      
      
   })
}

start()
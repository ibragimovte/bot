const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const sequelize = require('./db');
const UserModel = require('./models');

const token = '5201813144:AAFWtiqfqYQb5SmVCY0ESJ4EBJr6Jzp1z_E'

const bot = new TelegramApi(token, {polling: true} )

const chats ={}


const startGame = async (chatId) => {
   await bot.sendMessage(chatId, 'Угадай цифру от 0 до 9');
   const randomNumber = Math.floor(Math.random() * 10) 
   chats[chatId] = randomNumber;
   await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = async () => {

   try{
      await sequelize.authenticate()
      await sequelize.sync()
   } catch(e) {
      console.log('Подключение к бд сломалось', e)
   }

   bot.setMyCommands([
      {command: '/start', description:"Начальное приветствие"},
      {command: '/info', description:"Инфа"},
      {command: '/game', description:"Игра"}
   ])
   
   bot.on('message', async msg => {
      const text = msg.text;
      const chatId = msg.chat.id;
   
      try {
         if (text === '/start'){
            await UserModel.create({chatId})
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/3.jpg');
            return bot.sendMessage(chatId, 'Добро пожаловать ');
          }
          if (text === '/info'){
            const user = await UserModel.findOne({chatId})       
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}, правильных ответов: ${user.right}, неправильных: ${user.wrong}`);
          }
          if (text === '/game'){
            return startGame(chatId);
          }
          return bot.sendMessage(chatId, 'Моя твоя не понимать');

      } catch (e) {
         return bot.sendMessage(chatId, 'Что то сломалось');
         console.log(e)
      }
       

   })

   bot.on('callback_query', async msg =>{
      const data = msg.data;
      const chatId = msg.message.chat.id;
      if (data === '/again') {
         return startGame(chatId)
      }
      const user = await UserModel.findOne({chatId})

      if (data == chats[chatId]) {
         user.right += 1;         
         await bot.sendMessage(chatId, `Молодец, ты угадал цифру ${chats[chatId]}`, againOptions)
      } else { 
         user.wrong += 1;
         await bot.sendMessage(chatId, `Плохо, ты не угадал цифру ${chats[chatId]}`, againOptions)
      }
      await user.save();
      
   })
}

start()
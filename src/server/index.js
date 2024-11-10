const Fastify = require('fastify')
const { handler } = require('./controllers/switcher')
const { commonStartMenu } = require('./modules/common_menu')
const { isThisGroupId } = require('./modules/bot')
const { bot, globalBuffer } = require('./globalBuffer')

const app = Fastify({
  trustProxy: true
})

bot.on('message', async (msg) => {

  const chatId = msg.chat.id
  const text = msg.text
  if (await isThisGroupId(bot, chatId, msg)) return

  if (text === '/start' || (globalBuffer[chatId] === undefined)) {
    await commonStartMenu(bot, msg, true)
    await handler(bot, msg, undefined)
  } else {
    await handler(bot, msg, undefined)
  }
})

module.exports = { app, bot }

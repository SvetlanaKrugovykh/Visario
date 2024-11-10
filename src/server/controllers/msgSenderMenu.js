
const { globalBuffer } = require('../globalBuffer')
const { menuItems, translations } = require('../data/consts')
const { texts } = require('../modules/keyboard')
require('dotenv').config()

module.exports.sendAcceptedOrder = async function (bot, msg, lang = "en") {
  try {
    if (globalBuffer[msg.chat.id]?.selectedProducts === undefined) {
      await bot.sendMessage(msg.chat.id, texts[lang]['0_13'])
      return false
    }
    const GROUP_ID = process.env.GROUP_ID
    const selectedProducts = globalBuffer[msg.chat.id]?.selectedProducts
    if (!Array.isArray(selectedProducts) || selectedProducts.length === 0) {
      await bot.sendMessage(msg.chat.id, texts[lang]['0_9'])
      return
    }
    const products = selectedProducts
      .map(productId => `<b>${menuItems[lang][productId].description}</b>`)
      .join('\n')



    await bot.sendMessage(GROUP_ID, `Order from ${msg.chat.id}:\n${products}\n${module.exports.sayTimePeriod(msg.chat.id, globalBuffer[msg.chat.id]?.selectedTime, lang)}`, { parse_mode: "HTML" })

  } catch (err) {
    console.log(err)
  }
}

module.exports.sayTimePeriod = function (chatId, time, lang) {
  let timeTakeOff = texts[lang]['0_14'] || ''
  globalBuffer[chatId].selectedTime = time
  const selectedTime = time
    ? time.replace('1_time', translations[lang].tomorrow)
      .replace('0_time', translations[lang].today)
      .replace('_', '📎') : 'Time not specified'
  return `${timeTakeOff}: ${selectedTime}`
}
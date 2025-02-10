const { clientAdminMenuStarter } = require('../controllers/clientsAdmin')
require('dotenv').config()
const { buttonsConfig, texts } = require('./keyboard')
const { users } = require('../users/users.model')
const path = require('path')
const { globalBuffer, selectedByUser } = require('../globalBuffer')
const geo = require('./geo')
const { menuItems } = require('../data/consts')
const { generateIntervals } = require('../services/timeService')
const { sayTimePeriod } = require('../controllers/msgSenderMenu')
const { saveLanguage } = require('./common_functions')


module.exports.commonStartMenu = async function (bot, msg, home = false) {
  console.log(`/start at ${new Date()} tg_user_id: ${msg.chat.id}`)
  const adminUser = users.find(user => user.id === msg.chat.id)
  const lang = selectedByUser[msg.chat.id]?.language || 'en'
  if (adminUser) {
    await clientAdminMenuStarter(bot, msg, buttonsConfig["clientAdminStarterButtons"])
  } else {
    await clientAdminMenuStarter(bot, msg, buttonsConfig["clientAdminStarterButtons"])
    // await module.exports.userMenu(bot, msg, lang, home)
  }
}

module.exports.userMenu = async function (bot, msg, lang = "en", home = false) {
  if (!selectedByUser[msg.chat.id]) selectedByUser[msg.chat.id] = {}
  if (!globalBuffer[msg.chat.id]) globalBuffer[msg.chat.id] = {}


  selectedByUser[msg.chat.id] = {
    ...selectedByUser[msg.chat.id],
    language: lang,
    id: msg.chat.id,
    name: msg.chat.username + '---' + msg.chat.first_name + ' ' + msg.chat.last_name
  }

  const { lang_, authorized } = await module.exports.checkTgUser(msg, lang)
  globalBuffer[msg.chat.id].authorized = authorized

  if (authorized && home) {
    globalBuffer[msg.chat.id].authorized = true
    await module.exports.usersStarterMenu(bot, msg, lang_)
  } else {
    globalBuffer[msg.chat.id].authorized = false
    await module.exports.guestMenu(bot, msg, lang)
  }
}

module.exports.checkTgUser = async function (msg, lang = "en") {

  const info = {
    lang_: selectedByUser?.language || 'en',
    authorized: false
  }

  try {
    const response = await saveLanguage(msg, 'checkTgUser', selectedByUser[msg.chat.id])
    console.log('CheckTlgClient:', response)
    if (response !== null) {
      info.lang_ = response?.language || 'en'
    } else {
      console.log('No response from DB')
      info.lang_ = lang
      selectedByUser[msg.chat.id].language = lang
    }
  } catch (err) {
    console.log(err)
  }
  return info
}

module.exports.guestMenu = async function (bot, msg, lang = "en") {
  await bot.sendMessage(msg.chat.id, `<b>${process.env.BRAND_NAME}</b> ${texts[lang]['welcome']} <b>${msg.chat.first_name} ${msg.chat.last_name}</b>!`, { parse_mode: "HTML" })
  await bot.sendMessage(msg.chat.id, texts[lang]['0_0'], { parse_mode: "HTML" })
  await bot.sendMessage(msg.chat.id, buttonsConfig["guestMenu"].title[lang], {
    reply_markup: {
      keyboard: buttonsConfig["guestMenu"].buttons[lang],
      resize_keyboard: true
    }
  })
}

module.exports.guestChooseLanguageMenu = async function (bot, msg, lang = "en") {
  await bot.sendMessage(msg.chat.id, buttonsConfig["guestChooseLanguage"].title[lang], {
    reply_markup: {
      keyboard: buttonsConfig["guestChooseLanguage"].buttons[lang],
      resize_keyboard: true
    }
  })
}

module.exports.usersStarterMenu = async function (bot, msg, lang = "en") {
  await bot.sendMessage(msg.chat.id, buttonsConfig["usersStarterMenu"].title[lang], {
    reply_markup: {
      keyboard: buttonsConfig["usersStarterMenu"].buttons[lang],
      resize_keyboard: true
    }
  })
}

module.exports.supportScene = async function (bot, msg) {
  const GROUP_ID = process.env.GROUP_ID
  const lang = selectedByUser[msg.chat.id]?.language || 'en'
  try {
    const chatId = msg.chat.id
    await bot.sendMessage(chatId, `<i>${texts[lang]['0_2']}\n</i>`, { parse_mode: "HTML" })

    const collectedMessages = []

    const handleMessage = async (message) => {
      if (message.text) {
        collectedMessages.push({ type: 'text', content: message.text })
      } else if (message.photo) {
        const fileId = message.photo[message.photo.length - 1].file_id
        collectedMessages.push({ type: 'photo', fileId })
      } else if (message.document) {
        const fileId = message.document.file_id
        collectedMessages.push({ type: 'document', fileId })
      } else if (message.audio) {
        const fileId = message.audio.file_id
        collectedMessages.push({ type: 'audio', fileId })
      } else if (message.voice) {
        const fileId = message.voice.file_id
        collectedMessages.push({ type: 'voice', fileId })
      }
    }

    bot.on('message', async (message) => {
      if (message.chat.id === chatId) {
        await handleMessage(message)
      }
    })

    await new Promise((resolve) => setTimeout(resolve, 30000))

    for (const message of collectedMessages) {
      if (message.type === 'text') {
        await bot.sendMessage(GROUP_ID, `Message from ${msg.chat.first_name} ${msg.chat.last_name} (ID: ${msg.chat.id}):\n${message.content}`, { parse_mode: "HTML" })
      } else {
        await bot.sendMessage(GROUP_ID, `Message from ${msg.chat.first_name} ${msg.chat.last_name} (ID: ${msg.chat.id}):`, { parse_mode: "HTML" })
        if (message.type === 'photo') {
          await bot.sendPhoto(GROUP_ID, message.fileId)
        } else if (message.type === 'document') {
          await bot.sendDocument(GROUP_ID, message.fileId)
        } else if (message.type === 'audio') {
          await bot.sendAudio(GROUP_ID, message.fileId)
        } else if (message.type === 'voice') {
          await bot.sendVoice(GROUP_ID, message.fileId)
        }
      }
    }

    await bot.sendMessage(chatId, texts[lang]['0_4'], { parse_mode: "HTML" })

  } catch (err) {
    console.log(err)
    await bot.sendMessage(msg.chat.id, texts[lang]['0_5'])
  }
}

module.exports.downloadMenu = async function (bot, msg, lang = "en") {
  try {
    const filePath = path.join(__dirname, '../../../assets/menu', `${lang}.pdf`)
    await bot.sendDocument(msg.chat.id, filePath, {}, {
      filename: `${lang}.pdf`,
      contentType: 'application/pdf'
    })
  } catch (err) {
    console.log(err)
    await bot.sendMessage(msg.chat.id, texts[lang]['0_1'])
  }
}

module.exports.checkLocation = async function (bot, msg) {
  const chatId = msg.chat.id
  if (!selectedByUser[chatId]) selectedByUser[chatId] = {}
  if (!globalBuffer[chatId]) globalBuffer[chatId] = {}
  if (!selectedByUser[chatId]?.language) {
    const { lang_, authorized } = await module.exports.checkTgUser(msg)
    globalBuffer[msg.chat.id].authorized = authorized
    selectedByUser[chatId].language = lang_
  }

  if (!globalBuffer[chatId]?.authorized) {
    const cafeLocation = await geo.getCafeLocation()
    const clientLocation = await geo.requestLocation(bot, msg)
    const isWithinRange = await geo.checkDistance(cafeLocation, clientLocation)

    if (!isWithinRange) {
      await bot.sendMessage(msg.chat.id, texts[lang]['0_6'])
      return false
    }
  } else { return true }
  return true
}

module.exports.selectProducts = async function (bot, msg, lang = "en") {
  try {
    const chatId = msg.chat.id
    if (!globalBuffer[chatId]) globalBuffer[chatId] = {}

    globalBuffer[chatId].selectAction = 'selection'

    const data = {} // await getProducts()}

    const productsButtons = {
      title: buttonsConfig["usersStarterMenu"].title[lang],
      options: [{ resize_keyboard: true }],
      buttons: Object.values(data).map(product => [
        { text: `🤽🏿‍♂️ ${product.description}`, callback_data: `73_${product.id}` }
      ])
    }

    await bot.sendMessage(msg.chat.id, productsButtons.title, {
      reply_markup: {
        inline_keyboard: productsButtons.buttons,
        resize_keyboard: true
      }
    })
  } catch (error) {
    console.log(error)
    await bot.sendMessage(msg.chat.id, texts[lang]['0_5'])
  }
}

module.exports.removeProducts = async function (bot, msg, lang, operation) {
  try {
    const chatId = msg.chat.id
    const selectedProducts = globalBuffer[chatId]?.selectedProducts
    globalBuffer[chatId].selectAction = operation
    if (!Array.isArray(selectedProducts) || selectedProducts.length === 0) {
      await bot.sendMessage(chatId, texts[lang]['0_9'])
      return
    }

    const productButtons = {
      title: texts[lang]['0_10'],
      options: [{ resize_keyboard: true }],
      buttons: selectedProducts.map(productId => {
        const product = menuItems[lang][productId]
        return [{ text: `🤽🏿‍♂️ ${product.description}`, callback_data: productId }]
      })
    }

    await bot.sendMessage(chatId, `${texts[lang]['0_10']}`, {
      reply_markup: {
        inline_keyboard: productButtons.buttons,
        resize_keyboard: true
      }
    })

  } catch (error) { console.log(error) }
}

module.exports.ordersMenu = async function (bot, msg, lang = "en") {
  await bot.sendMessage(msg.chat.id, buttonsConfig["usersOrderMenu"].title[lang], {
    reply_markup: {
      keyboard: buttonsConfig["usersOrderMenu"].buttons[lang],
      resize_keyboard: true
    }
  })
}

module.exports.sendOrder = async function (bot, msg, lang = "en") {
  const chatId = msg.chat.id
  const selectedProducts = globalBuffer[chatId]?.selectedProducts
  if (!Array.isArray(selectedProducts) || selectedProducts.length === 0) {
    await bot.sendMessage(chatId, texts[lang]['0_9'])
    return
  }

  const products = selectedProducts
    .map(productId => `<b>${menuItems[lang][productId].description}</b>`)
    .join('\n')

  await bot.sendMessage(chatId, `${texts[lang]['0_10']}\n${products}\n${sayTimePeriod(msg.chat.id, globalBuffer[msg.chat.id]?.selectedTime, lang)}`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: texts[lang]['0_11'], callback_data: 'send_order' }],
        [{ text: texts[lang]['0_12'], callback_data: 'cancel_order' }]
      ]
    }
  })
}

module.exports.ChooseTime = async function (bot, msg, lang = "en") {
  const chatId = msg.chat.id
  const intervals = generateIntervals(lang)

  const todayButtons = intervals.today.intervals.map(time => [{ text: `${intervals.today.label}📎${time}`, callback_data: `0_time_${time}` }])
  const tomorrowButtons = intervals.tomorrow.intervals.map(time => [{ text: `${intervals.tomorrow.label}📎${time}`, callback_data: `1_time_${time}` }])

  await bot.sendMessage(chatId, intervals.today.label, {
    reply_markup: {
      inline_keyboard: todayButtons
    }
  })

  await bot.sendMessage(chatId, intervals.tomorrow.label, {
    reply_markup: {
      inline_keyboard: tomorrowButtons
    }
  })
}
const { saveLanguage_ } = require("../modules/tlg_to_DB")
const { inputLineScene } = require("../controllers/inputLine")

module.exports.saveLanguage = async function (msg, menuItem, selectedByUser) {
  try {
    let txtLanguage = 'en'
    if (menuItem === '0_9') txtLanguage = 'ru'

    let selectedByUser_ = { ...selectedByUser, language: txtLanguage, id: msg.chat.id, name: msg.chat.username + '---' + msg.chat.first_name + ' ' + msg.chat.last_name }
    await saveLanguage_(txtLanguage, msg.chat.id, msg.chat)
    return selectedByUser_
  } catch (err) {
    console.log(err)
    return selectedByUser
  }
}

module.exports.textInput = async function (bot, msg, menuItem, selectedByUser) {
  try {
    let inputLength = 15
    const txtCommand = await inputLineScene(bot, msg)

    if (!txtCommand || txtCommand.length < inputLength) {
      await bot.sendMessage(msg.chat.id, 'that`s not enough\n', { parse_mode: 'HTML' })
      const { sendClientAdminStarterButtons } = require('../controllers/clientsAdmin')
      await sendClientAdminStarterButtons(bot, msg, 'en')
      return selectedByUser
    }
    if (menuItem === '5_1') {
      selectedByUser = { ...selectedByUser, ticketTitle: txtCommand }
    } else if (menuItem === '5_2') {
      selectedByUser = { ...selectedByUser, ticketBody: txtCommand }
    }
    const { sendClientAdminStarterButtons } = require('../controllers/clientsAdmin')
    await sendClientAdminStarterButtons(bot, msg, 'en')
    return selectedByUser
  } catch (err) {
    console.log(err)
    const { sendClientAdminStarterButtons } = require('../controllers/clientsAdmin')
    await sendClientAdminStarterButtons(bot, msg, 'en')
    return selectedByUser
  }
}
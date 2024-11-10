
const { saveLanguage_ } = require("../modules/tlg_to_DB")


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
    let inputLenghth = 7
    if (msg?.text.includes('оментар')) inputLenghth = 2
    const txtCommand = await inputLineScene(bot, msg)

    if (!txtCommand || txtCommand.length < inputLenghth) {
      await bot.sendMessage(msg.chat.id, 'Незрозуміле введення. Операцію скасовано\n', { parse_mode: 'HTML' })
      return selectedByUser
    }
    if (menuItem === '5_1') {
      selectedByUser = { ...selectedByUser, ticketTitle: txtCommand }
    } else if (menuItem === '5_2') {
      selectedByUser = { ...selectedByUser, ticketBody: txtCommand }
    }
    return selectedByUser
  } catch (err) {
    console.log(err)
    return selectedByUser
  }
}

const { saveLanguage } = require("../modules/tlg_to_DB")


module.exports.saveLanguage = async function (bot, msg, menuItem, selectedByUser) {
  try {
    let txtLanguage = 'en'
    if (menuItem === '0_9') txtLanguage = 'ru'

    let selectedByUser_ = { ...selectedByUser, language: txtLanguage, id: msg.chat.id, name: msg.chat.username + '---' + msg.chat.first_name + ' ' + msg.chat.last_name }
    const signUpResult = await saveLanguage(txtLanguage, msg.chat.id, msg.chat)
    console.log('The signUpResult:', signUpResult)
    return selectedByUser_
  } catch (err) {
    console.log(err)
    return selectedByUser
  }
}


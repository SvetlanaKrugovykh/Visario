const { buttonsConfig } = require('../modules/keyboard')
const { users } = require('../users/users.model')
const menu = require('../modules/common_menu')
const { saveLanguage, textInput } = require('../modules/common_functions')
const { isThisGroupId } = require('../modules/bot')
const { globalBuffer, selectedByUser } = require('../globalBuffer')

function getCallbackData(text) {
  try {
    for (const buttonSet of Object.values(buttonsConfig)) {
      for (const langButtons of Object.values(buttonSet.buttons)) {
        for (const buttonRow of langButtons) {
          for (const button of buttonRow) {
            if (button.text === text) {
              return button.callback_data
            }
          }
        }
      }
    }
    return null
  } catch (error) { console.log(error) }
}

async function handler(bot, msg, webAppUrl) {
  const chatId = msg?.chat?.id
  const data = getCallbackData(msg.text)
  if (!chatId) return

  let selected_ = null
  if (!selectedByUser[chatId]) selectedByUser[chatId] = {}
  if (!globalBuffer[chatId]) globalBuffer[chatId] = {}
  let lang = selectedByUser[chatId]?.language || 'en'
  if (!selectedByUser[chatId]?.language) {
    const { lang_ } = await menu.checkTgUser(msg, lang)
    lang = lang_
  }

  console.log('The choice is:', data)
  switch (data) {
    case '0_1':
      await menu.guestChooseLanguageMenu(bot, msg)
      break
    case '0_2':
      await menu.supportScene(bot, msg, false)
      break
    case '0_3':
      await menu.downloadMenu(bot, msg, lang)
      break
    case '0_4':
      goBack(bot, msg)
      break
    case '0_5':
      await menu.usersStarterMenu(bot, msg, lang)
      break
    case '0_6':
    case '0_7':
    case '0_8':
    case '0_9':
      selected_ = await saveLanguage(bot, msg, data, selectedByUser[chatId])
      if (selected_?.language) selectedByUser[chatId].language = selected_.language
      await menu.commonStartMenu(bot, msg)
      break
    case '2_1':
      lang = selectedByUser[chatId]?.language || 'en'
      await menu.ordersMenu(bot, msg, lang)
      break
    case '3_1':
      const inZone = await menu.checkLocation(bot, msg)
      if (!inZone) return
      await menu.selectProducts(bot, msg, lang)
      break
    case '3_2':
      await menu.removeProducts(bot, msg, lang, 'finalize')
      break
    case '3_3':
      await menu.sendOrder(bot, msg, lang)
      break
    case '3_4':
      await menu.ChooseTime(bot, msg, lang)
      break
    case '5_1':
    case '5_2':
      selected_ = await textInput(bot, msg, data, selectedByUser[chatId])
      if (selected_) selectedByUser[chatId] = selected_
      break
    case '13_3':
      await bot.sendMessage(msg.chat.id, `Ok!\n`, {
        reply_markup: {
          remove_keyboard: true
        }
      })
      break
    default:
      if (msg.text === undefined) return
      if (await isThisGroupId(bot, msg.chat.id, msg)) return
      console.log(`default: ${msg.text}`)
      switchDynamicSceenes(bot, msg)
      break
  }
}

async function blockMenu(bot, msg) {
  await bot.sendMessage(msg.chat.id, 'Вибачте, але Ви не можете використовувати цей бот')
  await bot.sendMessage(msg.chat.id, 'Для повторного використання натисніть /start')
}

//#region dynamicKeyboads
async function switchDynamicSceenes(bot, msg) {
  const timeSymbols = ['🕖']
  try {
    if (msg.text.includes('🟦')) {
      await OrderApprovalScene('', bot, '', msg, null, true)
      return
    }
    if (msg.text.includes('📕') || msg.text.includes('☎︎') || msg.text.includes('🖐')) {
      // await showOrderInfo(bot, msg, true)
      // const OrderID = msg.text.match(/\d+/)?.[0]
      // if (!OrderID) return null
      // selectedByUser[msg.chat.id].updatedOrderId = OrderID
      // console.log(`selectedByUser[${msg.chat.id}].updatedOrderId`, selectedByUser[msg.chat.id].updatedOrderId)
      // if (!msg.text.includes('🖐')) selectedByUser[msg.chat.id].customer_login = msg.chat.id
      // await OrderUpdateScene(bot, msg, OrderID)
      return
    }
    if (msg.text.includes('🟨') || msg.text.includes('🟩')) {
      // await showOrderInfo(bot, msg)
      return
    }
    if (msg.text.includes('💹')) {
      // await OrderApprove(bot, msg)
      return

    }
    if (msg.text.includes('⭕')) {
      // await OrderReturn(bot, msg)
      return
    }
    if (timeSymbols.some(symbol => msg.text.includes(symbol))) {
      // await selectPeriod(bot, msg)
      // await checkReadyForReport(bot, msg)
      return
    }
    if (msg.text.includes('↖️')) {
      // await reports(bot, msg)
      return
    }
    if (/[🏠🟣🔵🧷📌✉✔️➕📕📒📗📘]/.test(msg.text)) {
      goBack(bot, msg)
      return
    }
  } catch (error) { console.log(error) }
}

async function goBack(bot, msg, forcefully = false) {
  try {
    if (msg.text.includes('🏠') || forcefully) {
      await menu.commonStartMenu(bot, msg, true)
    } else if (msg.text.includes('↩️')) {
      await menu.usersStarterMenu(bot, msg)
    }
  } catch (error) { console.log(error) }
}

//#endregion

module.exports = { handler, blockMenu }
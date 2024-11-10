const buttonsConfig = {
  guestMenu: {
    title: {
      pl: 'Proszę wybrać dzialanie',
      en: 'Please select an action',
      de: 'Bitte wählen Sie eine Aktion',
      ru: 'Оберіть, будь ласка, дію'
    },
    options: [{ resize_keyboard: true }],
    buttons: {
      en: [
        [{ text: '📝 Your ????', callback_data: '0_5' }],
        [{ text: '🇬🇧 🇷🇺 Select a language', callback_data: '0_1' }],
        [{ text: '✉︎ Ask us about anything in our business', callback_data: '0_2' }],
        [{ text: '🏠', callback_data: '0_4' }]
      ],
      ru: [
        [{ text: '📝 Ваші ?????', callback_data: '0_5' }],
        [{ text: '🇵🇱 🇬🇧 🇩🇪 🇺🇦 Виберіть мову', callback_data: '0_1' }],
        [{ text: '✉︎ Запитайте нас про що завгодно (в нашому бізнесі)', callback_data: '0_2' }],
        [{ text: '🏠', callback_data: '0_4' }]
      ]
    }
  },
  guestChooseLanguage: {
    title: {
      en: 'Please select a language',
      ru: 'Оберіть, будь ласка, мову'
    },
    options: [{ resize_keyboard: true }],
    buttons: {
      en: [
        [{ text: '🇬🇧 English', callback_data: '0_7' }],
        [{ text: '🇷🇺 Русский', callback_data: '0_9' }],
        [{ text: '↩️', callback_data: '0_12' }],
        [{ text: '🏠', callback_data: '0_4' }]
      ],
      ru: [
        [{ text: '🇬🇧 English', callback_data: '0_7' }],
        [{ text: '🇷🇺 Русский', callback_data: '0_9' }],
        [{ text: '↩️', callback_data: '0_12' }],
        [{ text: '🏠', callback_data: '0_4' }]
      ]
    }
  },
  usersStarterMenu: {
    title: {
      en: 'Please select an action',
      ru: 'Оберіть, будь ласка, дію'
    },
    options: [{ resize_keyboard: true }],
    buttons: {
      en: [
        [{ text: '📌 Create a new order', callback_data: '2_1' }],
        [{ text: '📒 Ready to get', callback_data: '2_3' }],
        [{ text: '📗 View completed orders', callback_data: '2_4' }],
        [{ text: '📕 Requests needing your clarification', callback_data: '2_11' }],
        [{ text: '🏠', callback_data: '0_4' }]
      ],
      ru: [
        [{ text: '📌 Створити нове замовлення', callback_data: '2_1' }],
        [{ text: '📒 Замовлення до отримання', callback_data: '2_3' }],
        [{ text: '📗 Переглянути замовлення, що вже є виконаними раніше', callback_data: '2_4' }],
        [{ text: '📕 Замовлення, за якими Ви не прийшли', callback_data: '2_11' }],
        [{ text: '🏠', callback_data: '0_4' }]
      ]
    }
  },
  usersOrderMenu: {
    title: {
      en: 'Please select an action',
      ru: 'Оберіть, будь ласка, дію'
    },
    options: [{ resize_keyboard: true }],
    buttons: {
      en: [
        [{ text: '🧲 Add a product', callback_data: '3_1' }],
        [{ text: '❌ Remove a product', callback_data: '3_2' }],
        [{ text: '🕖 Choose the time to get it', callback_data: '3_4' }],
        [{ text: '✅ Send the order', callback_data: '3_3' }],
        [{ text: '🏠', callback_data: '0_4' }]
      ],
      ru: [
        [{ text: '🧲 Додати продукт', callback_data: '3_1' }],
        [{ text: '❌ Видалити продукт', callback_data: '3_2' }],
        [{ text: '🕖 Виберіть час, коли хочете отримати замовлення', callback_data: '3_4' }],
        [{ text: '✅ Відправити замовлення', callback_data: '3_3' }],
        [{ text: '🏠', callback_data: '0_4' }]
      ]
    },
  },
  clientAdminStarterButtons: {
    title: {
      en: 'Please select an action',
      ru: 'Оберіть, будь ласка, дію'
    },
    options: [{ resize_keyboard: true }],
    buttons: {
      en: [
        [{ text: '🟣 Input the question', callback_data: '5_1' }],
        [{ text: '🔵 Input the answer', callback_data: '5_2' }],
        [{ text: 'Get the pair question-answer from the DB', callback_data: '3_21' }],
        [{ text: '📌 Add the pair question-answer to the DB', callback_data: '3_22' }],
        [{ text: 'Delete the pair question-answer to the DB', callback_data: '3_23' }],
        [{ text: 'Send reply to the client request', callback_data: '3_2' }],
        [{ text: 'Return', callback_data: '3_3' }]
      ],
      ru: [
        [{ text: '🟣 Введіть питання', callback_data: '5_1' }],
        [{ text: '🔵 Введіть відповідь', callback_data: '5_2' }],
        [{ text: 'Отримати пару питання-відповідь з БД', callback_data: '3_21' }],
        [{ text: '📌 Додати пару питання-відповідь в БД', callback_data: '3_22' }],
        [{ text: 'Видалити пару питання-відповідь з БД', callback_data: '3_23' }],
        [{ text: 'Відправити відповідь на запит клієнта', callback_data: '3_2' }],
        [{ text: 'Повернутися', callback_data: '3_3' }]
      ]
    }
  }
}


const texts = {
  en: {
    'welcome': 'is here to welcome you,',
    '0_0': 'We are open \n <b>Monday - Friday 8:00 - 17:00 </b>\n <b>Saturday 9:00-15:00</b>',
    '0_1': 'Sorry, there was an error sending the file.',
    '0_2': 'Leave a text message below.',
    '0_3': 'You have not left a meaningful message. Please try again',
    '0_4': 'Thank you! Your message has been sent.\n Wait for a response within 30 minutes',
    '0_5': 'There was an error processing your request.',
    '0_6': 'Sorry, you are too far from our café to place an order.',
    '0_7': 'Added:',
    '0_8': 'Removed:',
    '0_9': 'No products selected',
    '0_10': 'Selected products',
    '0_11': 'Send Order',
    '0_12': 'Cancel Order',
    '0_13': 'To send the message, select the products',
    '0_14': 'Time of order obtaining',
    '0_15': 'Your order has been accepted. Wait for the order to be ready for pickup. Total amount:',
  },
  ru: {
    'welcome': 'тут, щоб привітати вас,',
    '0_0': 'Ми працюємо \n <b>Понеділок - П\'ятниця 8:00 - 17:00</b> \n <b>Субота 9:00-15:00</b>',
    '0_1': 'Вибачте, сталася помилка під час відправлення файлу.',
    '0_2': 'Залиште текстове повідомлення нижче.',
    '0_3': 'Ви не залишили змістовного повідомлення. Будь ласка, спробуйте ще раз',
    '0_4': 'Дякуємо! Ваше повідомлення відправлено.\n Очікуйте відповіді протягом 30 хвилин',
    '0_5': 'Під час обробки вашого запиту сталася помилка.',
    '0_6': "Вибачте, ви занадто далеко від нашої кав'ярні, щоб зробити замовлення.",
    '0_7': 'Додано:',
    '0_8': 'Видалено:',
    '0_9': 'Продукти не вибрані',
    '0_10': 'Вибрані продукти',
    '0_11': 'Відправити замовлення',
    '0_12': 'Скасувати замовлення',
    '0_13': 'Для відправлення повідомлення виберіть продукти',
    '0_14': 'Час отримання замовлення',
    '0_15': 'Ваше замовлення прийнято. Очікуйте готовності замовлення для видачі. Загальна сума:',
  }
}
module.exports = { buttonsConfig, texts }

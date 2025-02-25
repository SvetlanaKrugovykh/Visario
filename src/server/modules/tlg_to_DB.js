const { Pool } = require('pg')
const dotenv = require('dotenv')

dotenv.config()

const client = new Pool({
  user: process.env.VIS_DB_USER,
  host: process.env.VIS_DB_HOST,
  database: process.env.VIS_DB_NAME,
  password: process.env.VIS_DB_PASSWORD,
  port: process.env.VIS_DB_PORT,
})

client.connect()

module.exports.saveLanguage_ = async function (language, id, chat) {
  try {
    const user = await module.exports.getTg_user(id)
    if (!user) {
      await module.exports.saveTg_user(id, chat.username, chat.first_name, chat.last_name)
    }
    const query = 'UPDATE tg_users SET language_code = $2 WHERE user_id = $1'
    await client.query(query, [id, language])
    console.log(`The language ${language} is saved for the user ${id}`)
  } catch (error) {
    console.error('Error when saving the language:', error)
  }
}

module.exports.getLanguage = async function (id) {
  try {
    const query = 'SELECT language_code FROM tg_users WHERE user_id = $1'
    const res = await client.query(query, [id])
    return res.rows.length > 0 ? res.rows[0].language_code : null
  } catch (error) {
    console.error('Error when getting the language:', error)
  }
}

module.exports.getTg_user = async function (id) {
  try {
    const query = 'SELECT * FROM tg_users WHERE user_id = $1'
    const res = await client.query(query, [id])
    return res.rows.length > 0 ? res.rows[0] : null
  } catch (error) {
    console.error('Error when getting the user:', error)
  }
}

module.exports.saveTg_user = async function (id, username, first_name, last_name) {
  try {
    const query = 'INSERT INTO tg_users (user_id, username, first_name, last_name) VALUES ($1, $2, $3, $4)'
    await client.query(query, [id, username, first_name, last_name])
    console.log(`The user ${id} is saved`)
  } catch (error) {
    console.error('Error when saving the user:', error)
  }
}


module.exports.addQuestionAnswer = async function (language, bot, chatId, question, answer) {
  try {
    const query = `INSERT INTO ${language} (question, answer) VALUES ($1, $2)`
    await client.query(query, [question, answer])
    console.log(`The pair "question-answer" is added for the language ${language}`)
    bot.sendMessage(chatId, `The question and answer are added to DB for the language ${language} successfully. The question is: ${question}, the answer is: ${answer}`)
  } catch (error) {
    console.error('Error when adding a question and answer:', error)
  }
}

module.exports.getQuestionAnswer = async function (language, question) {
  try {
    const query = `SELECT answer FROM ${language} WHERE question = $1`
    const res = await client.query(query, [question])
    return res.rows.length > 0 ? res.rows[0].answer : null
  } catch (error) {
    console.error('Error when getting an answer:', error)
  }
}

module.exports.deleteQuestionAnswer = async function (language, bot, chatId, question) {
  try {
    const query = `DELETE FROM ${language} WHERE question = $1`
    await client.query(query, [question])
    console.log(`The pair "question-answer" is deleted for the language ${language}`)
  } catch (error) {
    console.error('Error when deleting a question and answer:', error)
  }
}


module.exports.findSimilarQuestion = async function (language, queryText) {
  try {
    const similarityThreshold = 0.3
    const query = `
      SELECT question, answer
      FROM ${language}
      WHERE similarity(question, $1) > $2
      ORDER BY similarity(question, $1) DESC
      LIMIT 1
    `
    const res = await client.query(query, [queryText, similarityThreshold])
    return res.rows.length > 0 ? res.rows[0] : null
  } catch (error) {
    console.error('Error when searching for a similar question:', error);
  }
}

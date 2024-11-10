require('dotenv').config()
const { app } = require('./index')
const HOST = process.env.HOST || '127.0.0.1'

const updateTables = require('./db/tablesUpdate').updateTables

try {
  updateTables()
} catch (err) {
  console.log(err)
}

app.listen({ port: process.env.PORT || 7999, host: HOST }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }

  console.log(`${new Date()}:[API] Service listening on ${address}`)
})





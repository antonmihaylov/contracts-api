const { config } = require('dotenv')

config({ path: '.env.test' })
config()

const { syncAll } = require('./dist/models/SyncAll')

module.exports = async () => {
  await syncAll({ force: true })
}

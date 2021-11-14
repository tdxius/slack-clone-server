const { MongoClient } = require('mongodb')

const DB_URL = 'mongodb://mongo:mongo@mongo:27017'
const DB_DATABASE = 'slack'

module.exports = async function () {
  const client = new MongoClient(DB_URL)
  await client.connect();

  return client.db(DB_DATABASE);
}


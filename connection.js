const elasticsearch = require('elasticsearch')

// Core ES variables for this project
const index = 'myjob'
const type = '_doc'
const port = 9200
const host = '139.196.161.84'
const password = 'changeme'
const client = new elasticsearch.Client({ host: { host, port }, httpAuth: `elastic:${password}`})

/** Check the ES connection status */
async function checkConnection () {
  let isConnected = false
  while (!isConnected) {
    console.log('Connecting to ES')
    try {
      const health = await client.cluster.health({})
      console.log(health)
      isConnected = true
    } catch (err) {
      console.log('Connection Failed, Retrying...', err)
    }
  }
}


module.exports = {
  client, index, type, checkConnection
}

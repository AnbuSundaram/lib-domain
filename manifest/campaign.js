const createDomain = require('../lib/create-domain')

module.exports = createDomain('campaign', {
  lambdaPort: 3011,
  offlinePort: 4001
})

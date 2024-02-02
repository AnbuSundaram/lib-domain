const createDomain = require('../lib/create-domain')

module.exports = createDomain('web', {
  lambdaPort: 3010,
  offlinePort: 3333
})

const createDomain = require('../lib/create-domain')

module.exports = createDomain('shipping', {
  lambdaPort: 3018,
  offlinePort: 4081
})

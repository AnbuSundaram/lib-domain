const createDomain = require('../lib/create-domain')

module.exports = createDomain('pim', {
  offlinePort: 4069,
  lambdaPort: 3009,
  private: true
})

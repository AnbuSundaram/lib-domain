const createDomain = require('../lib/create-domain')

module.exports = createDomain('components', {
  lambdaPort: 3013,
  offlinePort: 4029,
  private: true
})

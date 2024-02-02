const createDomain = require('../lib/create-domain')

module.exports = createDomain('cms', {
  lambdaPort: 3012,
  offlinePort: 4026
})

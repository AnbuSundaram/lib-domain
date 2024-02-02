const createDomain = require('../lib/create-domain')

module.exports = createDomain('search', {
  lambdaPort: 3017,
  offlinePort: 4071
})

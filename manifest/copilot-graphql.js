const createDomain = require('../lib/create-domain')

module.exports = createDomain('copilotGraphql', {
  lambdaPort: 3014,
  offlinePort: 4443,
  public: true
})

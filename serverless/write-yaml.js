const fs = require('fs')
const path = require('path')
const createYml = require('./create-yaml')

module.exports = function writeServerlessYml (domainId, options) {
  options = options || {}
  fs.writeFileSync(
    path.join(options.base || process.cwd(), 'serverless.yml'),
    createYml(domainId, options)
  )
}

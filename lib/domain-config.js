// Domains by client id
const byClientId = {
  default: (domainId, options) => ({
    domainName: `${options.stage}.${options.clientId}.ydv.live`,
    certificateName: `*.${options.clientId}.ydv.live`,
    basePath: domainId
  }),
  eddiebauer: (domainId, options) => {
    // No custom domain for eddiebauer
    return null
  }
}

module.exports = function getDomainConfig (domainId, options) {
  const get = byClientId[options.clientId] || byClientId.default
  return get(domainId, options)
}

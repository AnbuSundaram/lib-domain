const phin = require('phin').promisified
const merge = require('lodash/merge')
const qs = require('qs')
const Logger = require('@ydv/logger')
const { getSiteContext } = require('../site-context')

module.exports = function createRequestPreset (presetId, createDefaults) {
  if (typeof presetId === 'function') {
    createDefaults = presetId
    presetId = 'request'
  }
  const log = Logger(presetId)

  if (typeof createDefaults !== 'function') {
    const _defaults = createDefaults
    createDefaults = () => _defaults || {}
  }

  ;['get', 'put', 'post', 'patch', 'head', 'delete'].forEach(method => {
    request[method] = function wrapped (url, options) {
      return request(url, { ...options, method: method.toUpperCase() })
    }
  })

  return request

  async function request (url, options) {
    const siteContext = options.siteContext || getSiteContext()
    const defaults = {
      url,
      timeout: 15 * 1000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(siteContext && {
          'x-site-context': JSON.stringify(siteContext)
        })
      }
    }
    options = merge(defaults, createDefaults(url, options || {}), options)

    if (options.query) {
      options.url += '?' + qs.stringify(options.query)
      delete options.query
    }

    // log.silly('send', options)

    const res = await phin({
      timeout: 5000,
      ...options
    })
    if (options.parse !== 'none') {
      try {
        const str = res.body.toString().trim()
        res.body = str ? JSON.parse(str) : null
      } catch (error) {
        throw new Error('Unexpected end of JSON input')
      }
    }
    if (res.statusCode < 200 || res.statusCode >= 400) {
      const errorData = res.body || 'Unknown Request Error'
      errorData.response = res
      throw errorData
    }
    return res
  }
}
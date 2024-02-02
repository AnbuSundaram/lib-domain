const assert = require('assert')
const omit = require('lodash/omit')
const path = require('path')
const glob = require('glob')
const { getRouteOptions } = require('@ydv/swagger-route')
const domainManifest = require('../manifest')

module.exports = findRoutes

function findRoutes (domainId, options) {
  const functions = {}
  const manifest = domainManifest[domainId]

  if (options.findFunctions) return options.findFunctions(domainId, options)

  glob
    .sync('app/routes/**/*.js', { cwd: options.base || process.cwd() })
    .map(relpath => ({
      relpath,
      handler: require(path.join(options.base, relpath)).handler
    }))
    .forEach(data => {
      try {
        assert(data.handler, `[${data.relpath}]: exports.handler expected!`)
        const routeOptions = getRouteOptions(data.handler)

        const lambdaId = [
          path.dirname(data.relpath).replace('app/routes/', ''),
          path.basename(data.relpath, '.js')
        ]
          .join('-')
          .replace(/\//g, '-')

        functions[lambdaId] = {
          handler: `${path.dirname(data.relpath)}/${path.basename(
            data.relpath,
            '.js'
          )}.handler`,
          events: [
            {
              http: {
                ...omit(routeOptions, 'definition'),
                path: routeOptions.path,
                method: routeOptions.method.toLowerCase(),
                private:
                  options.offline || options.public || manifest.public
                    ? false
                    : 'private' in routeOptions
                      ? Boolean(routeOptions.private)
                      : true
              }
            }
          ]
        }
      } catch (error) {
        console.error(
          `@ydv/lib-domain | create-function error at ${data.relpath}`,
          error
        )
        throw error
      }
    })

  return functions
}

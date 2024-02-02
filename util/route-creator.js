const { Route } = require('@ydv/swagger-route')
const { connect } = require('../lib/mongo')
const { setSiteContext } = require('../site-context')
const Logger = require('@ydv/logger')
const log = Logger('router')

module.exports = function createRouteCreator (url, dbOptions) {
  return function createRoute (handler, options) {
    const wrappedHandler = async (event, context, callback) => {
      if (url) {
        // https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
        // the following line is critical for performance reasons to allow re-use of database
        // connections across calls to this Lambda function and avoid closing the database connection.
        // The first call to this lambda function takes longer to complete and connect, while subsequent
        // close calls will take no time.
        context.callbackWaitsForEmptyEventLoop = false
        await connect(url, dbOptions ? dbOptions.replicaSet : false)
      }
       // Handle Warmup call
    if (event.source === 'serverless-plugin-warmup') {
      log.silly('WarmUp - Lambda is warm!')
      /** Slightly delayed (25ms) response to ensure concurrent invocation */
      await new Promise((resolve, reject) =>
        setTimeout(resolve, parseInt(process.env.WARMUP_WAIT) || 25)
      )
      return {
        body: 'Lambda is warm!'
      }
    }
      if (event && event.headers && event.headers['x-site-context']) {
        try {
          event.siteContext = JSON.parse(event.headers['x-site-context'])
          setSiteContext(event.siteContext)
        } catch (_) {
          console.error('Failed to parse x-site-context header')
        }
      } else {
        event.siteContext = {
          IS_TEST_CONTEXT: true,
          channel: 'com',
          date: new Date()
        }
      }

      return handler(event, context, callback)
    }
    return Route(wrappedHandler, options)
  }
}

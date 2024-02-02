const manifest = require('../manifest')

module.exports = function createProvider (domainId, options) {
  return {
    name: 'aws',
    runtime: 'nodejs12.x',
    timeout: 90,
    stage: options.stage || 'development',
    region: 'us-east-1',
    environment: {
      NODE_PATH: '.',
      SERVERLESS_STAGE: options.stage || '',
      NODE_ENV: options.stage || 'development',
      REGION: process.env.REGION || 'us-east-1',
      YDV_CLIENT_ID: options.clientId || '',
      ITEM_API_ID: process.env.ITEM_API_ID || '',
      ATOMIC_API_ID: process.env.ATOMIC_API_ID || '',
      CHANNEL_API_ID: process.env.CHANNEL_API_ID || '',
      ORDER_API_ID: process.env.ORDER_API_ID || '',
      INVENTORY_API_ID: process.env.INVENTORY_API_ID || '',
      PAYMENT_API_ID: process.env.PAYMENT_API_ID || '',
      PIM_API_ID: process.env.PIM_API_ID || '',
      IDENTITY_API_ID: process.env.IDENTITY_API_ID || '',
      CMS_API_ID: process.env.CMS_API_ID || '',
      CART_API_ID: process.env.CART_API_ID || '',
      COMPONENTS_API_ID: process.env.COMPONENTS_API_ID || '',
      OFFER_API_ID: process.env.OFFER_API_ID || '',
      WEB_API_ID: process.env.WEB_API_ID || '',
      MFINVENTORY_API_ID: process.env.MFINVENTORY_API_ID || '',
      ITEM_API_KEY: process.env.ITEM_API_KEY || '',
      ATOMIC_API_KEY: process.env.ATOMIC_API_KEY || '',
      CHANNEL_API_KEY: process.env.CHANNEL_API_KEY || '',
      ORDER_API_KEY: process.env.ORDER_API_KEY || '',
      INVENTORY_API_KEY: process.env.INVENTORY_API_KEY || '',
      PIM_API_KEY: process.env.PIM_API_KEY || '',
      IDENTITY_API_KEY: process.env.IDENTITY_API_KEY || '',
      CMS_API_KEY: process.env.CMS_API_KEY || '',
      CART_API_KEY: process.env.CART_API_KEY || '',
      COMPONENTS_API_KEY: process.env.COMPONENTS_API_KEY || '',
      OFFER_API_KEY: process.env.OFFER_API_KEY || '',
      MFINVENTORY_API_KEY: process.env.MFINVENTORY_API_KEY || '',
      MONGODB_URL: process.env.MONGODB_URL || '',
      PAYMENT_API_KEY: process.env.PAYMENT_API_KEY || '',
      PAYMENT_SERVICE_URL:
        process.env.PAYMENT_SERVICE_URL ||
        'https://dev.eddiebauer-payment-service.com',
      PAYMENT_SERVICE_KEY:
        process.env.PAYMENT_SERVICE_KEY ||
        'DdlS6GDBxv26OFPea3UYz2FER2zBKJu07InV0f2b',
      REDISDB_URL: process.env.REDISDB_URL || 'redis://localhost:6379'
    },
    ...(manifest[domainId].private && {
      apiGateway: {
        apiKeys: [
          `${options.stage}_${options.clientId}_${domainId}`.toUpperCase()
        ],
        metrics: true
      }
    }),
    logs: {
      restApi: {
        accessLogging: true,
        format: 'requestId: $context.requestId',
        executionLogging: false
      }
    },
    ...(options.subnetIds.length > 0 && {
      vpc: {
        securityGroupIds: options.securityGroupIds,
        subnetIds: options.subnetIds
      }
    }),
    ...(manifest[domainId].iamRoleStatements && {
      iam: {
        role: {
          statements: manifest[domainId].iamRoleStatements
        }
      }
    }),
    usagePlan: {
      quota: {
        limit: 10000 * 60 * 60 * 24, // 10,000 per second limit, stretched over a day
        offset: 0,
        period: 'DAY'
      },
      throttle: {
        burstLimit: 3000,
        rateLimit: 3000
      }
    }
  }
}

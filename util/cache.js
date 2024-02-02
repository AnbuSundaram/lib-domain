const redis = require('redis')
const { promisify } = require('util')
const Logger = require('@ydv/logger')
const log = Logger('rediscache')

let redisNotConnected = false
let redisClient, redisGetAsync, redisDelAsync, redisSetAsync
let cachedKeys = []
const connectRedis = () => {
  if (!redisClient) {
    log.info(`Connecting redisclient from lib domain::::::`)
    redisClient = redis.createClient({
      url: process.env.REDISDB_URL,
      connect_timeout: 2000
    })
    redisGetAsync = promisify(redisClient.get.bind(redisClient))
    redisSetAsync = promisify(redisClient.set.bind(redisClient))
    redisDelAsync = promisify(redisClient.del.bind(redisClient))

    redisClient.on('error', err => {
      log.error('Redis error', err)
      if (/connection timeout/.test(err.message)) {
        redisNotConnected = true
      }
    })
  }
}

exports.setRedisCache = async function (key, value, timeInSecs) {
  try {
    if (redisNotConnected) return
    connectRedis()
    await redisSetAsync(key, JSON.stringify(value), 'EX', timeInSecs)
    cachedKeys.push(key)
  } catch (error) {
    log.error(`Error while setting the key ${key} to Redis`, error)
  }
}

exports.getRedisCache = async function (key) {
  try {
    if (redisNotConnected) return
    connectRedis()
    const result = await redisGetAsync(key)
    if (result != null) {
      return JSON.parse(result)
    }
  } catch (error) {
    log.error(`Error while getting the key ${key} from Redis`, error)
    return null
  }
}

exports.clearCache = async function (cachedkey) {
  if (redisNotConnected) return
  connectRedis()
  let success = false
  try {
    if (cachedkey === 'all') {
      await Promise.all(cachedKeys.map(key => redisDelAsync(key)))
      success = true
      return { cachedKeys, success }
    } else {
      await redisDelAsync(cachedkey)
      return { cachedkey, success }
    }
  } catch (error) {
    log.debug('error clearing cache', error)
    return { success }
  }
}

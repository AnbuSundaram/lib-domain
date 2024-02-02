const omit = require('lodash/omit')
const mongoose = require('mongoose')
const mongooseLeanVirtuals = require('mongoose-lean-virtuals')
const Logger = require('@ydv/logger')

const log = Logger('lib-domain/mongo')
exports.db = mongoose // need this for transactions
var __setOptions = mongoose.Query.prototype.setOptions
mongoose.Query.prototype.setOptions = function (options, overwrite) {
  return __setOptions.call(
    this,
    {
      ...options,
      lean: {
        virtuals: true
      }
    },
    overwrite
  )
}

exports.connect = async (mongoUrl, replicaSet = false) => {
  log.silly(
    `moongoose connection readyState >>>> ${mongoose.connection.readyState}`
  )
  try {
    if (
      mongoose.connection.readyState !== mongoose.connection.states.connected
    ) {
      let mongoParams = {
        autoIndex: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false, // Disable mongoose buffering
        maxPoolSize: process.env.MONGO_CONNECTION_POOLSIZE || 100, // As per the latest mongo DB 5 version default value is 100
        serverSelectionTimeoutMS: 30000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: process.env.MONGO_SOCKET_TIMEOUT || 120000 , // Get config else Close sockets after 120 seconds of inactivity
      }
      if (replicaSet) {
        mongoParams.replicaSet = 'rs'
      }
      await mongoose.connect(mongoUrl, mongoParams)
      log.silly(`connected to database...`)
    }
  } catch (error) {
    log.silly('moongoose connection on error :::', error)
  }
}

mongoose.connection.on('error', error => {
  log.silly(
    'mongoose default connection has occured following error :::',
    error
  )
})

mongoose.connection.on('disconnected', error => {
  log.silly('moongoose disconnected error :::', error)
})

mongoose.connection.on('reconnected', reconnectionInfo => {
  log.silly('moongoose reconnected log :::', reconnectionInfo)
})

mongoose.connection.on('close', () => {
  log.silly('moongoose close log :::')
})


exports.Types = mongoose.Schema.Types

// In serverless-offline, this file will re-run every time
// an endpoint is called. This will cause it to create a Mongoose
// model twice and error. We get around this with this wrapper.
// See https://github.com/dherault/serverless-offline/issues/258
exports.Model = (name, schema) => {
  try {
    return mongoose.model(name, schema)
  } catch (_) {
    return mongoose.model(name)
  }
}

exports.Schema = (attributes, options) => {
  options = {
    toJSON: {
      getters: true,
      virtuals: true,
      transform: (doc, object) => {
        // Omit common private properties from toJSON
        return omit(object, ['password', '__v'])
      }
    },
    id: false, // remove copy of _id in the end result
    timestamps: true,
    ...options
  }

  const schema = new mongoose.Schema(attributes, options)
  schema.plugin(mongooseLeanVirtuals)
  return schema
}

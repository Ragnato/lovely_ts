import logger from '../logger/index.js'
import database from './database/index.js'
import apis from './api/index.js'
import helper from './helper/index.js'
import pgPromise from 'pg-promise'

let apiClients: { [key: string]: any } = {}
let databaseConnection: pgPromise.IDatabase<any>

const generateApiClients = () => {
  apiClients['github'] = apis.github
}

const initDB = () => {
  database.init()
  databaseConnection = database.connection()
}

const serviceFactory = {
  init: () => {
    generateApiClients(), initDB()
  },
  getApiClients: () => {
    if (helper.funcs.isEmpty(apiClients)) {
      generateApiClients()
    }

    return apiClients
  },
  getDatabaseConnection: () => {
    if (databaseConnection === null) {
      initDB()
    }

    return databaseConnection
  },
  debug: () => {
    logger.log('debug', `Debug Api Clients: ` + Object.keys(apiClients))
  },
}

export default serviceFactory

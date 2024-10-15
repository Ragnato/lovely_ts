import configHelper from '../helper/config.js'
import pgPromise from 'pg-promise'
import tables from './tables/index.js'

const pgp = pgPromise()

let connection: pgPromise.IDatabase<any>

const init = () => {
  const dbConfig = configHelper.getDatabaseConfig()
  const cn = {
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database_name,
    user: dbConfig.user,
    password: dbConfig.password,
    max: 30,
  }
  connection = pgp(cn)
}

const database = {
  tables: tables,
  init,
  connection: () => {
    if (!connection) {
      init()
    }

    return connection
  },
}

export default database

import serviceFactory from './serviceFactory.js'
import lovelyStayService from './services/lovelyStay.js'
import pgPromise from 'pg-promise'
import logger from '../logger/index.js'
import constants from './constants/index.js'

serviceFactory.init()

const connection: pgPromise.IDatabase<any> =
  serviceFactory.getDatabaseConnection()

const action: string = process.argv[2]
if (!action) {
  logger.log('error', 'Missing action')
  process.exit()
}

switch (action) {
  case constants.actions.USER:
    const username: string = process.argv[3]
    if (!username) {
      logger.log('error', 'Missing Github username')
      process.exit()
    }

    try {
      lovelyStayService.getGithubUser(connection, username)
    } catch (error) {
      logger.log(
        'error',
        `Some error happened with the following info: ${error}`
      )
      process.exit()
    }

    logger.log('info', 'User updated/saved with success!')

    break
  case constants.actions.DISPLAY:
    const location: string = process.argv[3]

    try {
      lovelyStayService.displayAllUsers(connection, location)
    } catch (error) {
      logger.log(
        'error',
        `Some error happened with the following info: ${error}`
      )
      process.exit()
    }
    break
  case constants.actions.LANGUAGES:
    try {
      const username: string = process.argv[3]
      if (!username) {
        logger.log('error', 'Missing Github username')
        process.exit()
      }
      lovelyStayService.getUserProgramingLanguages(connection, username)
    } catch (error) {
      logger.log(
        'error',
        `Some error happened with the following info: ${error}`
      )
      process.exit()
    }
    break
  default:
    logger.log('error', 'Invalid action')
    process.exit()
}

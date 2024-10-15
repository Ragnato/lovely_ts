import serviceFactory from '../serviceFactory.js'
import constants from '../constants/index.js'
import tables from '../database/tables/index.js'
import pgPromise from 'pg-promise'
import mappers from '../mapper/index.js'
import helper from '../helper/index.js'
import { UserInfo } from '../mapper/githubUser.js'

const getGithubUser = async (
  connection: pgPromise.IDatabase<any>,
  username: string
) => {
  const client = serviceFactory.getApiClients()[constants.apis.GITHUB]

  try {
    const user = await client.getUser(username)
    const userInfo: UserInfo  = mappers.githubUserMapper.extractGithubUserInfo(user.data)
    const existingUser = await tables.githubUser.getUser(connection, userInfo)
    if (existingUser) {
      tables.githubUser.updateUser(connection, userInfo, existingUser)
    } else {
      tables.githubUser.saveUser(connection, userInfo)
    }
  } catch (error) {
    throw new Error(
      `Something went wrong with getting Github user with the following error: ${error}`
    )
  }
}

const displayAllUsers = async (
  connection: pgPromise.IDatabase<any>,
  location: string | null
) => {
  const limit: number = 10
  let offset: number = 0
  let hasMore: boolean = true

  const allUsers: Array<any> = []

  if (location) {
    while (hasMore) {
      try {
        const users =
          await tables.githubUser.getAllUsersInfoByLocationWithLimitAndOffset(
            connection,
            location,
            limit,
            offset
          )

        if (users.length === 0) {
          hasMore = false
        } else {
          allUsers.push(...users)
          offset += limit
        }
      } catch (error) {
        throw new Error(
          `Something went wrong with getting Github users by location with the following error: ${error}`
        )
      }
    }
  } else {
    while (hasMore) {
      try {
        const users = await tables.githubUser.getAllUsersInfoWithLimitAndOffset(
          connection,
          limit,
          offset
        )

        if (users.length === 0) {
          hasMore = false
        } else {
          allUsers.push(...users)
          offset += limit
        }
      } catch (error) {
        throw new Error(
          `Something went wrong with getting Github users with the following error: ${error}`
        )
      }
    }
  }

  console.log(allUsers)
}

const getUserProgramingLanguages = async (
  connection: pgPromise.IDatabase<any>,
  username: string
) => {
  const client = serviceFactory.getApiClients()[constants.apis.GITHUB]

  const repos = await client.getUserRepositories(username)

  const userReposInfo = mappers.githubUserMapper.extracRepositoriesInfoFromUser(
    repos.data
  )

  let allUserLanguages: string[] = []

  for (const repoName of userReposInfo.repositoriesName) {
    const repoLanguages = await client.getRepoLanguages(
      userReposInfo.username,
      repoName
    )

    if (!helper.funcs.isEmptyObject(repoLanguages.data)) {
      const languages = mappers.githubUserMapper.extractRepoLanguages(
        repoLanguages.data
      )

      languages.forEach((language: string) => {
        if (!allUserLanguages.includes(language)) {
          allUserLanguages.push(language)
        }
      })
    }
  }

  const currentUserLanguages = await tables.githubUser.getUserLanguages(
    connection,
    userReposInfo.githubUserId
  )

  console.log(currentUserLanguages)

  if (
    currentUserLanguages === null ||
    currentUserLanguages.languages === null ||
    currentUserLanguages.languages.length === 0
  ) {
    await tables.githubUser.updateUserLanguages(
      connection,
      userReposInfo.githubUserId,
      allUserLanguages
    )

    console.log('User languages: ', allUserLanguages)
  } else {
    const currentUserLanguagesArray: string[] =
      currentUserLanguages.languages.split(',')
    const combinedLanguages: string[] = [
      ...allUserLanguages,
      ...currentUserLanguagesArray,
    ]
    const uniqueLanguages: string[] = [...new Set(combinedLanguages)]

    await tables.githubUser.updateUserLanguages(
      connection,
      userReposInfo.githubUserId,
      uniqueLanguages
    )

    console.log('User languages: ', uniqueLanguages)
  }
}

const lovelyStayService = {
  getGithubUser,
  displayAllUsers,
  getUserProgramingLanguages,
}

export default lovelyStayService

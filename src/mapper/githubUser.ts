import { GithubUserRepositoriesApiModel } from '../api/models/index.js'

export interface UserRepositoriesInfo {
  githubUserId: number
  username: string
  repositoriesName: string[]
}

export interface UserInfo {
    githubId: number
    username: string
    name: string
    location: string
    email: string
    type: string
    company: string
    url: string
}

const extractGithubUserInfo = (githubUserInfo: any): UserInfo => {
  return {
    githubId: githubUserInfo.id,
    username: githubUserInfo.login,
    name: githubUserInfo.name || '',
    location: githubUserInfo.location || '',
    email: githubUserInfo.email || '',
    type: githubUserInfo.type,
    company: githubUserInfo.company || '',
    url: githubUserInfo.avatar_url,
  }
}

const extracRepositoriesInfoFromUser = (
  githubUserInfo: GithubUserRepositoriesApiModel[]
): UserRepositoriesInfo => {
  let usersRepositoriesInfo: UserRepositoriesInfo = {
    githubUserId: githubUserInfo[0]?.owner?.id,
    username: githubUserInfo[0]?.owner?.login,
    repositoriesName: [],
  }

  let repositoryNames: string[] = []

  githubUserInfo.forEach((element) => {
    repositoryNames.push(element.name)
  })

  usersRepositoriesInfo.repositoriesName = repositoryNames

  return usersRepositoriesInfo
}

const extractRepoLanguages = (languages: any): string[] => {
  return Object.keys(languages)
}

const githubUserMapper = {
  extractGithubUserInfo,
  extracRepositoriesInfoFromUser,
  extractRepoLanguages,
}

export default githubUserMapper

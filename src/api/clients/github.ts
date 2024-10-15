import { Octokit } from 'octokit'
import configHelper from '../../helper/index.js'

const octokitClient = new Octokit({
  auth: configHelper.config.getGithubToken(),
})

const getUser = (username: string) => {
  return octokitClient.request('GET /users/{username}', {
    username: username,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
}

const getUserRepositories = (username: string) => {
  return octokitClient.request('GET /users/{username}/repos', {
    username: username,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
}

const getRepoLanguages = (owner: string, repo: string) => {
  return octokitClient.request('GET /repos/{owner}/{repo}/languages', {
    owner: owner,
    repo: repo,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
}

const githubClient = {
  getUser,
  getUserRepositories,
  getRepoLanguages,
}

export default githubClient

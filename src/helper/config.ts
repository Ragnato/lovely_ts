import config from '../../config/index.js'

const getApiConfig = () => {
  return config.get('api')
}

const getDatabaseConfig = () => {
  return config.get('database')
}

const getGithubToken = () => {
  return config.get('github_token')
}

const configHelper = {
  getApiConfig,
  getDatabaseConfig,
  getGithubToken,
}

export default configHelper

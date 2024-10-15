interface GithubUserRepositoriesOwner {
  id: number
  login: string
}

export interface GithubUserRepositories {
  id: number
  name: string
  fullName: string
  owner: GithubUserRepositoriesOwner
}

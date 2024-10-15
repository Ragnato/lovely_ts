const { expect } = require('chai')
const githuUserMapper = require('../../../src/mapper/githubUser.ts')

describe('Mapping tests', () => {
  describe('GithubUser', () => {
    it('extractGithubUserInfo', () => {
      const tests = [
        {
          name: 'testing with all info',
          in: {
            id: 1234,
            login: "Test",
            name: "nameTest",
            location: "there",
            email: "email@test.com",
            type: "USER",
            company: "Google",
            avatar_url: "https://facebook.com/jpg/image/there"
          },
          out: {
            github_id: 1234,
            username: "Test",
            name: "nameTest",
            location: "there",
            email: "email@test.com",
            type: "USER",
            company: "Google",
            url: "https://facebook.com/jpg/image/there"
          },
        },
      ]

      tests.forEach((t) =>
        it(t.name, () => {
          const result = githubUserMapper.extractGithubUserInfo(t.in)
          expect(result).toBe(t.out);
        })
      )
    })
  })
})

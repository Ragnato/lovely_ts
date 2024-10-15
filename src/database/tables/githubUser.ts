import pgPromise from 'pg-promise'
import { UserInfo } from '../../mapper/githubUser'
const { ParameterizedQuery } = pgPromise

const getUser = (conn: pgPromise.IDatabase<any>, userInfo: UserInfo) => {
  const existingUserQuery = new ParameterizedQuery({
    text: `
      SELECT id, github_user_avatar_id FROM github_user WHERE github_id = $1;
    `,
    values: [userInfo.githubId],
  })

  return conn.oneOrNone(existingUserQuery)
}

const saveUser = async (conn: pgPromise.IDatabase<any>, userInfo: UserInfo) => {
  await conn.tx(async (t) => {
    const insertPlanQuery = new ParameterizedQuery({
      text: `
        INSERT INTO github_user_avatar (url, created_at, updated_at)
        VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id;
      `,
      values: [userInfo.url],
    })

    const githubUserAvatar = await t.one(insertPlanQuery)

    const insertUserQuery = new ParameterizedQuery({
      text: `
        INSERT INTO github_user (github_id, name, username, location, email, type, company, github_user_avatar_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id;
      `,
      values: [
        userInfo.githubId,
        userInfo.name,
        userInfo.username,
        userInfo.location,
        userInfo.email,
        userInfo.type,
        userInfo.company,
        githubUserAvatar.id,
      ],
    })

    const githubUserId = await t.one(insertUserQuery)
  })
}

const updateUser = async (
  conn: pgPromise.IDatabase<any>,
  userInfo: any,
  existingUser: any
) => {
  await conn.tx(async (t) => {
    const updateUserQuery = new ParameterizedQuery({
      text: `
        UPDATE github_user 
        SET name = $1,
            username = $2,
            location = $3, 
            email = $4, 
            type = $5, 
            company = $6, 
            github_user_avatar_id = $7, 
            updated_at = CURRENT_TIMESTAMP
        WHERE github_id = $8;
      `,
      values: [
        userInfo.name,
        userInfo.username,
        userInfo.location,
        userInfo.email,
        userInfo.type,
        userInfo.company,
        userInfo.github_user_avatar_id,
        userInfo.github_id,
      ],
    })

    await t.none(updateUserQuery)

    const updatePlanQuery = new ParameterizedQuery({
      text: `
        UPDATE github_user_avatar 
        SET url = $1
        WHERE id = $2;
      `,
      values: [userInfo.url, existingUser.github_user_avatar_id],
    })

    await t.none(updatePlanQuery)
  })
}

const getAllUsersInfoWithLimitAndOffset = (
  conn: pgPromise.IDatabase<any>,
  limit: number,
  offset: number
) => {
  const query = `
    SELECT 
      gu.github_id, 
      gu.name,
      gu.username,
      gu.location, 
      gu.email, 
      gu.type, 
      gu.company,
      gu.languages, 
      gu.created_at, 
      gu.updated_at, 
      gua.url AS avatar_url
    FROM 
      github_user gu
    LEFT JOIN 
      github_user_avatar gua 
    ON 
      gu.github_user_avatar_id = gua.id
    ORDER BY 
      gu.created_at DESC
    LIMIT $1 OFFSET $2;
  `

  return conn.any(query, [limit, offset])
}

const getAllUsersInfoByLocationWithLimitAndOffset = (
  conn: pgPromise.IDatabase<any>,
  location: string,
  limit: number,
  offset: number
) => {
  const query = `
    SELECT 
      gu.github_id, 
      gu.name, 
      gu.username,
      gu.location, 
      gu.email, 
      gu.type, 
      gu.company, 
      gu.languages, 
      gu.created_at, 
      gu.updated_at, 
      gua.url AS avatar_url
    FROM 
      github_user gu
    LEFT JOIN 
      github_user_avatar gua 
    ON 
      gu.github_user_avatar_id = gua.id
    WHERE 
      gu.location = $3
    ORDER BY 
      gu.created_at DESC
    LIMIT $1 OFFSET $2;
  `

  return conn.any(query, [limit, offset, location])
}

const getUserLanguages = (conn: pgPromise.IDatabase<any>, githubId: number) => {
  const query = `
    SELECT languages
    FROM github_user
    WHERE github_id = $1;
  `

  return conn.oneOrNone(query, [githubId])
}

const updateUserLanguages = (
  conn: pgPromise.IDatabase<any>,
  githubId: number,
  newLanguages: string[]
) => {
  const query = `
    UPDATE github_user
    SET languages = $1
    WHERE github_id = $2;
  `

  return conn.none(query, [newLanguages, githubId])
}

const githubUserTable = {
  saveUser,
  getUser,
  updateUser,
  getAllUsersInfoWithLimitAndOffset,
  getAllUsersInfoByLocationWithLimitAndOffset,
  getUserLanguages,
  updateUserLanguages,
}

export default githubUserTable

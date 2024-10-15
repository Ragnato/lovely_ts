const path = require('path')

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '172.21.0.2',
      user: 'lovely_stay',
      password: 'lovely',
      database: 'lovely_stay',
    },
    migrations: {
      directory: path.join(__dirname, 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'seeds'),
    },
  },
}

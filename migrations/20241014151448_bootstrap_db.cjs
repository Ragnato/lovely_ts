exports.up = function (knex) {
  return knex.schema
    .createTable('github_user_avatar', (table) => {
      table.increments('id').primary() // Primary key
      table.string('url').notNullable() // Avatar URL
      table.timestamp('created_at').defaultTo(knex.fn.now()) // Timestamp for creation
      table.timestamp('updated_at').defaultTo(knex.fn.now()) // Timestamp for last update
    })
    .createTable('github_user', (table) => {
      table.increments('id').primary() // Primary key
      table.integer('github_id').notNullable().unique() // Unique GitHub ID
      table.string('name') // User's name
      table.string('location') // User's location
      table.string('email') // User's email
      table.string('type') // Type of user (e.g., User, Organization)
      table.string('company') // User's company
      table.text('languages') // User's programming languages (stored as text)
      table.string('username') // GitHub username
      table
        .integer('github_user_avatar_id')
        .unsigned()
        .references('id')
        .inTable('github_user_avatar')
        .onDelete('SET NULL') // Foreign key reference
      table.timestamp('created_at').defaultTo(knex.fn.now()) // Timestamp for creation
      table.timestamp('updated_at').defaultTo(knex.fn.now()) // Timestamp for last update
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('github_user') // Drop the github_user table first
    .dropTableIfExists('github_user_avatar') // Drop the github_user_avatar table
}

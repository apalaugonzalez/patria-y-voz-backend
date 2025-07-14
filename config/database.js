// path: ./config/database.js
const parse = require('pg-connection-string').parse;

module.exports = ({ env }) => {
  // Use a single DATABASE_URL for production environments
  if (env('NODE_ENV') === 'production') {
    const config = parse(env('DATABASE_URL'));
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          password: config.password,
          ssl: {
            // Use this to connect to remote databases
            rejectUnauthorized: false
          },
        },
        debug: false,
      },
    }
  }

  // Use detailed variables for local development, including your custom settings
  return {
    connection: {
      client: 'postgres',
      connection: {
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: {
          // Important for connecting to your Railway DB from local machine
          rejectUnauthorized: false
        },
      },
      // Your specific debug and pool settings for local development
      debug: true,
      pool: { min: 0, max: 7 },
    },
  }
};
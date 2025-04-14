// knexfile.ts
import type { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST ,
      port: +(process.env.DB_PORT || 5432),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
        directory: path.resolve(__dirname, 'migrations'),
        extension: 'ts',
    },
  },
};

export default config;

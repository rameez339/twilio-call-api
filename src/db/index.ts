import { Model, knexSnakeCaseMappers } from 'objection';
import knex, { Knex } from 'knex';
import { logger } from '../logger';

const {
    DB_CLIENT,
    DB_NAME,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASS,
    DB_CON_MIN,
    DB_CON_MAX
} = process.env;

if (!DB_CLIENT) {
  throw new Error("DB_CLIENT is missing from the environment variables");
}

const db: Knex = knex({
    client: DB_CLIENT as string,
    connection: {
        host: DB_HOST as string,
        port: parseInt(DB_PORT || '5432'),
        user: DB_USER as string,
        password: DB_PASS as string,
        database: DB_NAME as string,
    },
    pool: {
        min: parseInt(DB_CON_MIN || '5'),
        max: parseInt(DB_CON_MAX || '50'),
    },
    ...knexSnakeCaseMappers(),
});

Model.knex(db);

export default db;

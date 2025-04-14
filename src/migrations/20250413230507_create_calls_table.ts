// src/migrations/20250413215551_create_calls_table.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('calls');
  if (!exists) {
    return knex.schema.createTable('calls', (table) => {
      table.increments('id').primary();
      table.string('caller_id').notNullable();
      table.string('receiver_id').notNullable();
      table.timestamp('start_time', { useTz: true }).defaultTo(knex.fn.now());
      table.string('status').defaultTo('pending');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('calls');
}

exports.up = function(knex) {
  return knex.schema.createTable('media', (table) => {
    table.increments('id').primary();
    table.string('original_name').notNullable();
    table.string('storage_path').notNullable();
    table.string('mime_type').notNullable();
    table.integer('size_bytes').notNullable();
    table.string('file_hash').notNullable();
    table.json('metadata');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('media');
};

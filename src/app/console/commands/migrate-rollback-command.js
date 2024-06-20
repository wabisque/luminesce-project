import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { Command } from '@dreamitdev/luminesce/console';

export default class MigrateRollbackCommand extends Command {
  /** @type {string} */
  static get tag() {
    return 'migrate:rollback';
  }

  /**
   * @returns {Promise<string?>}
   */
  async execute() {
    const all = this._args.all;

    // ensure that the migrations table is created.
    await this._app.db.execute(`
      CREATE TABLE IF NOT EXISTS \`migrations\`
        (
          \`id\` INT UNSIGNED AUTO_INCREMENT NOT NULL,
          \`migration\` VARCHAR(512) NOT NULL,
          \`batch\` INT UNSIGNED NOT NULL,
          CONSTRAINT \`migrations_id_primary_key\` PRIMARY KEY (\`id\`),
          CONSTRAINT \`migrations_migration_unique_key\` UNIQUE (\`migration\`)
        ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
    `);
    
    const records = await this._app.db.execute(`
      SELECT *
      FROM \`migrations\`
      ${all ? '' : 'WHERE \`batch\` = (SELECT MAX(\`batch\`) FROM \`migrations\`)'}
      ORDER BY \`id\` DESC;
    `);

    if(records.length == 0) {
      return 'Nothing to rollback.';
    }

    const migrationsPath = join(this._app.basePath, 'database/migrations');

    for(const record of records) {
      const content = await readFile(
        join(migrationsPath, record.migration),
        {
          encoding: 'utf8',
        }
      );
      const [ , command ] = content
        .split('--- // ---')
        .map(command => command.trim());

      await this._app.db.execute(command);
      await this._app.db.execute(
        `
          DELETE FROM \`migrations\`
          WHERE \`id\` = :id;
        `,
        {
          id: record.id
        }
      );

      console.log(`Rollback [${record.migration}] — DONE`);
    }
  }
}

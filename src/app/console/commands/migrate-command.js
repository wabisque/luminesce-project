import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { Command } from '@dreamitdev/luminesce/console';

export default class MigrateCommand extends Command {
  /** @type {string} */
  static get tag() {
    return 'migrate';
  }

  /**
   * @returns {Promise<string?>}
   */
  async execute() {
    const fresh = Boolean(this._args.fresh);

    const migrationsPath = join(this._app.basePath, './database/migrations');
    const migrations = await readdir(migrationsPath);

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
      ORDER BY \`id\` DESC;
    `);

    if(fresh) {
      for(const record of records) {
        const content = await readFile(
          join(migrationsPath, record.migration),
          {
            encoding: 'utf8',
          }
        );
        const [ , command ] = content.split('--- // ---');
  
        await this._app.db.execute(command);
        await this._app.db.execute(
          `
            DELETE FROM \`migrations\`
            WHERE \`id\` = :id;
          `,
          {
            id: record.id,
          }
        );
  
        console.log(`Rollback [${record.migration}] — DONE`)
      }

      records.splice(0, records.length);
      
      console.log();
    }

    const batch = Math.max(0, ...records.map(record => record.batch)) + 1;
    const targets = migrations.filter(migration => !records.some(record => record.migration == migration));

    if(targets.length == 0) {
      return 'Nothing to migrate.';
    }

    for(const target of targets) {
      const content = await readFile(
        join(migrationsPath, target),
        {
          encoding: 'utf8',
        }
      );
      const [ command ] = content
        .split('--- // ---')
        .map(command => command.trim());

      await this._app.db.execute(command);
      await this._app.db.execute(
        `
          INSERT INTO \`migrations\`
            (\`migration\`, \`batch\`)
          VALUES
            (:migration, :batch);
        `,
        {
          migration: target,
          batch,
        }
      );

      console.log(`Migrate [${target}] — DONE`);
    }

    return null;
  }
}

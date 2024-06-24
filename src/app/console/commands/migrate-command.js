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
    const refresh = Boolean(this._args.refresh);

    const migrationsPath = join(this._app.basePath, './database/migrations');
    const migrations = await readdir(migrationsPath);

    if(fresh) {
      await this._app.db.reset();
    }

    const records = await this._app.db.execute(`
      SELECT *
      FROM \`migrations\`
      ORDER BY \`id\` DESC;
    `);

    if(refresh) {
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

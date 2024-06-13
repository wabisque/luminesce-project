import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import Command from '../../../../vendors/luminesce/console/command.js';

export default class MigrateCommand extends Command {
  /** @type {string} */
  static get tag() {
    return 'migrate';
  }

  /**
   * @returns {Promise<string?>}
   */
  async execute() {
    const migrationsPath = join(this._app.basePath, './database/migrations');
    const migrations = await readdir(migrationsPath);

    // ensure that the migrations table is created.
    await this._app.db.execute('CREATE TABLE IF NOT EXISTS `migrations` (`id` INT UNSIGNED AUTO_INCREMENT NOT NULL,`migration` VARCHAR(512) NOT NULL,`batch` INT UNSIGNED NOT NULL,CONSTRAINT `migrations_id_primary_key` PRIMARY KEY (`id`),CONSTRAINT `migrations_migration_unique_key` UNIQUE (`migration`)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;');

    const records = await this._app.db.execute('SELECT * FROM `migrations`;');
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
        'INSERT INTO `migrations` (`migration`, `batch`) VALUES (:migration, :batch);',
        {
          migration: target,
          batch,
        }
      );

      console.log(`[${target}] — DONE`);
    }

    return null;
  }
}

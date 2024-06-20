import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import moment from 'moment';

import Command from '../../../../vendors/luminesce/console/command.js';

export default class MakeMigrationCommand extends Command {
  /** @type {string} */
  static get tag() {
    return 'make:migration';
  }

  /**
   * @returns {Promise<string?>}
   */
  async execute() {
    const table = this._args.table?.replaceAll('-', '_') ?? '';
    const raw = Boolean(this._args.raw);
    const view = Boolean(this._args.view);

    // ensure that the table provided is valid
    if(typeof table != 'string' || !/^[a-z]+(_[a-z]+)*$/g.test(table)) {
      throw new Error('Invalid table.');
    }

    // fetch the migrations directory path
    const targetPath = join(this._app.basePath, 'database/migrations');

    // ensure that the migrations directory exists
    if(!existsSync(targetPath)) {
      await mkdir(
        targetPath,
        {
          recursive: true,
        }
      );
    }

    const type = view ? '-view' : (raw ? '' : '-table');

    // fetch migration stub
    const stub = await readFile(
      join(this._app.basePath, `resources/stubs/migration${type}`),
      {
        encoding: 'utf8',
      }
    );

    const filePath = join(
      targetPath,
      `${moment().format('YYYY-MM-DD-HHmmssSSS')}-${view || !raw ? 'create-' : ''}${table.replaceAll('_', '-')}${type}`
    );

    // create migration file
    await writeFile(
      filePath,
      stub.replace(/\{\{\s*table\s*\}\}/g, table)
    );

    return `Migration [${filePath}] created successfully.`;
  }
}

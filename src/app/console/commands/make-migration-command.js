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
    const raw = 'raw' in this._args;
    const view = 'view' in this._args;

    // ensure that the table provided is valid
    if(!/^[a-z]+(_[a-z]+)*$/g.test(table)) {
      throw new Error('Invalid table name.');
    }

    // fetch the migrations directory path
    const targetPath = join(this._app.basePath, './database/migrations');

    // ensure that the migrations directory exists
    if(!existsSync(targetPath)) {
      await mkdir(
        targetPath,
        {
          recursive: true,
        }
      );
    }

    // fetch migration stub
    const stub = await readFile(
      join(
        this._app.basePath,
        `./resources/stubs/migration${
          view ? '-view' : (raw ? '' : '-table')
        }`
      ),
      {
        encoding: 'utf8',
      }
    );

    const filePath = join(
      this._app.basePath,
      `./database/migrations/${
        moment().format('YYYY-MM-DD-HHmmssSSS')
      }-${
        view || !raw ? 'create-' : ''}${table.replaceAll('_', '-')
      }${
        view ? '-view' : (raw ? '' : '-table')
      }`
    );

    // create migration file
    await writeFile(
      filePath,
      stub.replace(/\{\{\s*table\s*\}\}/g, table)
    );

    return `Migration [${filePath}] created successfully.`;
  }
}

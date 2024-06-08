import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import moment from 'moment';

import Command from '../../../vendors/core/terminal/command.js';

export default class MakeTableMigrationCommand extends Command {
  static get tag() {
    return 'make:migration:table';
  }

  /**
   * @type {string}
   */
  #migrationsPath;
  /**
   * @type {string}
   */
  #stubPath;
  /**
   * @type {string}
   */
  #tableName;

  constructor(terminal, args) {
    super(terminal, args);

    this.#migrationsPath = join(this._terminal.basePath, './database/migrations');
    this.#stubPath = join(this._terminal.basePath, './resources/stubs/migration-table');
  }

  async execute() {
    this.#validate();

    await this.#ensureMigrationsFolderExists();

    await this.#createMigrationFile();
  }

  async #createMigrationFile() {
    const stub = await this.#fetchStub();
    const filename = `${moment().format('YYYY-MM-DD-HHmmssSSS')}-create-${this.#tableName.replaceAll('_', '-')}-table-migration`;
    const filePath = join(this.#migrationsPath, filename);

    await writeFile(
      filePath,
      stub.replaceAll('{{table_name}}', this.#tableName)
    );

    console.log(`\x1b[37m\x1b[44m INFO \x1b[0m Migration \x1b[1m[${filePath}]\x1b[0m created successfully.`);
  }

  async #ensureMigrationsFolderExists() {
    if(!existsSync(this.#migrationsPath)) {
      await mkdir(
        this.#migrationsPath,
        {
          recursive: true,
        }
      );
    }
  }

  async #fetchStub() {
    return await readFile(
      this.#stubPath,
      {
        encoding: 'utf8',
      }
    );
  }

  #validate() {
    this.#tableName = this._args[0]?.trim();

    if(!/^[a-z]+(_[a-z]+)*$/g.test(this.#tableName)) {
      console.log('\x1b[37m\x1b[41m ERROR \x1b[0m Invalid table name provided.');

      throw new Error('Invalid table name provided.');
    }
  }
}

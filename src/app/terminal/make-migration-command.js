import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import moment from 'moment';

import Command from '../../../vendors/core/terminal/command.js';

export default class MakeMigrationCommand extends Command {
  static get tag() {
    return 'make:migration';
  }

  /**
   * @type {bool}
   */
  #isRaw;
  /**
   * @type {bool}
   */
  #isView;
  /**
   * @type {string}
   */
  #migrationsPath;
  /**
   * @type {string}
   */
  #tableName;

  constructor(terminal, args) {
    super(terminal, args);

    this.#migrationsPath = join(this._terminal.basePath, './database/migrations');
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
      stub
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
    const stubPath = join(
      this._terminal.basePath,
      this.#isView 
      ? './resources/stubs/migration-view'
      : (
        this.#isRaw
        ? './resources/stubs/migration'
        : './resources/stubs/migration-table'
      )
    );

    const content = await readFile(
      stubPath,
      {
        encoding: 'utf8',
      }
    );

    return content.replaceAll('{{table_name}}', this.#tableName);
  }

  #validate() {
    const tableName = this._args[0]?.trim();
    const isView = this._args.some(arg => /-[A-Za-z]*v[A-Za-z]*/g.test(arg) || arg == '--view');
    const isRaw = this._args.some(arg => /-[A-Za-z]*r[A-Za-z]*/g.test(arg) || arg == '--raw');

    if(!tableName) {
      console.log('\x1b[37m\x1b[41m ERROR \x1b[0m Table name is required.');

      throw new Error('Table name is required.');
    }

    if(!/^[a-z]+(_[a-z]+)*$/g.test(tableName)) {
      console.log('\x1b[37m\x1b[41m ERROR \x1b[0m Invalid table name provided.');

      throw new Error('Invalid table name provided.');
    }

    this.#isRaw = isRaw;
    this.#isView = isView;
    this.#tableName = tableName;
  }
}

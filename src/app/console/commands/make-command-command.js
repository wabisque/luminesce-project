import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import moment from 'moment';

import Command from '../../../../vendors/luminesce/console/command.js';

export default class MakeCommandCommand extends Command {
  /** @type {string} */
  static get tag() {
    return 'make:command';
  }

  /**
   * @returns {Promise<string?>}
   */
  async execute() {
    const name = this._args.name;
    const tag = this._args.tag ?? '';

    // ensure that the name provided is valid
    if(!/^[A-Z][A-Za-z]*$/g.test(name)) {
      throw new Error('Invalid name.');
    }

    // fetch the migrations directory path
    const targetPath = join(this._app.basePath, './app/console/commands');

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
      join(this._app.basePath, './resources/stubs/command'),
      {
        encoding: 'utf8',
      }
    );

    const fileName = name
      .replace(/^[A-Z]/g, $0 => $0.toUpperCase())
      .replace(/[A-Z]/g, $0 => `-${$0.toLowerCase()}`);
    const filePath = join(targetPath, `./${fileName}.js`);

    if(existsSync(filePath)) {
      throw new Error('Command already exists.');
    }

    // create migration file
    await writeFile(
      filePath,
      stub
        .replace(/\{\{\s*name\s*\}\}/g, name)
        .replace(/\{\{\s*tag\s*\}\}/g, tag)
    );

    return `Command [${filePath}] created successfully.`;
  }
}

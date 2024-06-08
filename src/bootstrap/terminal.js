import { join } from 'node:path';

import Terminal from '../../vendors/core/terminal/terminal.js';
import MakeTableMigrationCommand from '../app/terminal/make-table-migration-command.js';

const instance = new Terminal(join(import.meta.dirname, '..'));

// register commands
instance.register(MakeTableMigrationCommand);

export default instance;

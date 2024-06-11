import { join } from 'node:path';

import Terminal from '../../vendors/core/terminal/terminal.js';
import MakeMigrationCommand from '../app/terminal/make-migration-command.js';

const instance = new Terminal(join(import.meta.dirname, '..'));

// register commands
instance.register(MakeMigrationCommand);

export default instance;

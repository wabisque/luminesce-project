import MakeMigrationCommand from '../app/console/commands/make-migration-command.js';
import MigrateCommand from '../app/console/commands/migrate-command.js';
import app from '../bootstrap/app.js';

// console commands
app.console.register(MakeMigrationCommand);
app.console.register(MigrateCommand);

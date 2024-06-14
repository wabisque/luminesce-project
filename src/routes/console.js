import MakeCommandCommand from '../app/console/commands/make-command-command.js';
import MakeMigrationCommand from '../app/console/commands/make-migration-command.js';
import MigrateCommand from '../app/console/commands/migrate-command.js';
import MigrateRollbackCommand from '../app/console/commands/migrate-rollback-command.js';
import app from '../bootstrap/app.js';

// console commands
app.console.register(MakeCommandCommand);
app.console.register(MakeMigrationCommand);
app.console.register(MigrateCommand);
app.console.register(MigrateRollbackCommand);

import Router from '../../vendors/luminesce/facades/router.js';
import MakeCommandCommand from '../app/console/commands/make-command-command.js';
import MakeMigrationCommand from '../app/console/commands/make-migration-command.js';
import MigrateCommand from '../app/console/commands/migrate-command.js';
import MigrateRollbackCommand from '../app/console/commands/migrate-rollback-command.js';

// console commands
Router.command(MakeCommandCommand);
Router.command(MakeMigrationCommand);
Router.command(MigrateCommand);
Router.command(MigrateRollbackCommand);

import Router from '../../vendors/luminesce/facades/router.js';
import MakeMigrationCommand from '../app/console/commands/make-migration-command.js';
import MigrateRollbackCommand from '../app/console/commands/migrate-rollback-command.js';

// console commands
Router.command(MakeMigrationCommand);
Router.command(MigrateRollbackCommand);

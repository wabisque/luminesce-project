import Router from '../../vendors/luminesce/facades/router.js';
import MigrateCommand from '../app/console/commands/migrate-command.js';
import MigrateRollbackCommand from '../app/console/commands/migrate-rollback-command.js';

// console commands
Router.command(MigrateCommand);
Router.command(MigrateRollbackCommand);

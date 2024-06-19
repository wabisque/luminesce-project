import RouteBuilder from '../http/routing/route-builder.js';
import RouteGroupBuilder from '../http/routing/route-group-builder.js';
import Facade from './facade.js';

export default class Router extends Facade {
  /**
   * @param {Record<string, typeof import('../../http/routing/route-binding.js').default>} bindings
   * @returns {RouteGroupBuilder}
   */
  static bind(bindings) {
    return new RouteGroupBuilder(this._app, undefined, undefined, bindings);
  }

  /**
   * @param {typeof import('../../console/command.js').default} commandCtor
   * @returns {void}
   */
  static command(commandCtor) {
    this._app.console.register(commandCtor);
  }

  /**
   * @param {string} path
   * @param {typeof import('../../http/action/action.js').default} action
   * @returns {RouteBuilder}
   */
  static get(path, action) {
    return Router.match(
      [
        'get',
      ],
      path,
      action
    );
  }

  /**
   * @param {('get'|'post'|'put'|'delete'|'options')[]} methods
   * @param {string} path
   * @param {typeof import('../../http/action/action.js'.default)} action
   * @returns {RouteBuilder}
   */
  static match(methods, path, action) {
    return new RouteBuilder(this._app, methods, path, action);
  }

  /**
   * @param  {...typeof import('../../http/middleware/middleware.js').default} middleware
   * @returns {RouteGroupBuilder}
   */
  static middleware(...middleware) {
    return new RouteGroupBuilder(this._app, undefined, middleware);
  }

  /**
   * @param {string} path
   * @returns {RouteGroupBuilder}
   */
  static prefix(path) {
    return new RouteGroupBuilder(this._app, path);
  }
}

import Route from './route.js';

export default class RouteBuilder {
  /** @type {import('../../application/application.js').default} */;
  #app;
  /** @type {Route} */
  #route;

  /**
   * @param {import('../../application/application.js').default} app
   * @param {('get'|'post'|'put'|'delete'|'options')[]} methods
   * @param {string} path
   * @param {typeof import('../action/action.js').default} action
   */
  constructor(app, methods, path, action) {
    this.#app = app;

    this.#route = new Route(
      this.#app,
      methods,
      `${this.#app.router.context.path}/${path}`,
      action,
      this.#app.router.context.middleware,
      this.#app.router.context.bindings
    );

    this.#app.router.register(this.#route);
  }

  /**
   * @param {Record<string, typeof import('./route-binding.js').default>} bindings
   * @returns {this}
   */
  bind(bindings) {
    this.#route.bindings = bindings;

    return this;
  }

  /**
   * @param  {...typeof import('../middleware/middleware.js').default} middleware
   * @returns {this}
   */
  middleware(...middleware) {
    this.#route.middleware = middleware;

    return this;
  }
}

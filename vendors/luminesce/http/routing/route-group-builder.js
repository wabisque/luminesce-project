import RouteContextStack from './route-context-stack.js';

export default class RouteGroupBuilder {
  /** @type {import('../../application/application.js').default} */
  #app;
  /** @type {Record<string, typeof import('./route-binding.js').default>} */
  #bindings;
  /** @type {typeof import('../middleware/middleware.js').default[]} */
  #middleware;
  /** @type {string} */
  #path;

  /**
   * @param {import('../../application/application.js').default} app
   * @param {string} [path]
   * @param {typeof import('../middleware/middleware.js').default[]} [middleware]
   * @param {Record<string, typeof import('./route-binding.js').default>} [bindings]
   */
  constructor(app, path = '', middleware = [], bindings = {}) {
    this.#app = app;
    this.#path = path;
    this.#middleware = middleware;
    this.#bindings = bindings;
  }

  /**
   * @param {Record<string, typeof import('./route-binding.js').default>} bindings
   * @returns {this}
   */
  bind(bindings) {
    for(const key in bindings) {
      this.#bindings[key] = bindings[key];
    }

    return this;
  }

  /**
   * @param {() => void|Promise<void>} callback
   * @return {Promise<void>}
   */
  async group(callback) {
    this.#app.router.context.push(new RouteContextStack(
      this.#path,
      this.#middleware,
      this.#bindings
    ));

    await callback();

    context.pop();
  }

  /**
   * @param  {...typeof import('../middleware/middleware.js').default} middleware 
   * @returns {this}
   */
  middleware(...middleware) {
    this.#middleware.push(...middleware);

    return this;
  }

  /**
   * @param {string} path
   * @returns {this}
   */
  prefix(path) {
    this.#path = path;

    return this;
  }
}

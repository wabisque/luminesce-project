export default class RouteContextStack {
  /** @type {Record<string, typeof import('./route-binding.js').default>} */
  get bindings() {
    return this.#bindings;
  }
  /** @type { typeof import('../middleware/middleware.js').default[]} */
  get middleware() {
    return this.#middleware;
  }
  /** @type {string} */
  get path() {
    return this.#path;
  }
  /** @type {Record<string, typeof import('./route-binding.js').default>} */
  #bindings;
  /** @type {typeof import('../middleware/middleware.js').default[]} */
  #middleware;
  /** @type {string} */
  #path;

  /**
   * 
   * @param {string} [path]
   * @param {typeof import('../middleware/middleware.js').default[]} [middleware] 
   * @param {Record<string, typeof import('./route-binding.js').default>} [bindings] 
   */
  constructor(path = '', middleware = [], bindings = {}) {
    this.#path = path;
    this.#middleware = middleware;
    this.#bindings = bindings;
  }
}

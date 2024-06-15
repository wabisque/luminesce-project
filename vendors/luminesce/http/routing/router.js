import RouteContext from './route-context.js';

export default class Router {
  /** @type {RouteContext} */
  get context() {
    return this.#context;
  }
  /** @type {RouteContext} */
  #context;
  /** @type {import('./route.js').default[]} */
  #routes = [];

  /**
   * @param {import('../../application/application.js').default} app
   */
  constructor() {
    this.#context = new RouteContext();
  }

  /**
   * @param {import('../request/request.js').default} method
   * @returns {Promise<import('./route-match.js').default>}
   */
  async match(request) {
    for(const route of this.#routes) {
      const match = await route.match(request);

      if(match != null) {
        return match;
      }
    }

    throw new Error('Route not found.');
  }

  /**
   * @param {import('./route.js').default} route
   * @return {void}
   */
  register(route) {
    this.#routes.unshift(route);
  }
}

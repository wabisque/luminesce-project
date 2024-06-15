export default class RouteMatch {
  /** @type {Record<string, string>} */
  get parameters() {
    return this.#parameters;
  }
  /** @type {import('./route.js').default} */
  get route() {
    return this.#route;
  }

  /** @type {Record<string, string>} */
  #parameters;
  /** @type {import('./route.js').default} */
  #route;

  /**
   * @param {import('./route.js').default} route 
   * @param {Record<string, string>} parameters 
   */
  constructor(route, parameters = {}) {
    this.#route = route;
    this.#parameters = parameters;
  }

  /**
   * @param {import('../request/request.js')} request
   * @returns {Promise<import('../response/response.js')>}
   */
  async execute(request) {
    return await this.#route.execute(request);
  }
}

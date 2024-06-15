export default class RouteBinding {
  /** @type {import('../../application/application.js').default} */
  get _app() {
    return this.#app;
  }
  /** @type {import('../request/request.js').default} */
  get _request() {
    return this.#request;
  }
  /** @type {string} */
  _value;
  /** @type {import('../../application/application.js').default} */
  #app;
  /** @type {import('../request/request.js').default} */
  #request;

  /**
   * @param {import('../../application/application.js').default} app
   * @param {import('../request/request.js').default} request
   * @param {string} value
   */
  constructor(app, request, value) {
    this.#app = app;
    this.#request = request;
    this._value = value;
  }

  /**
   * @returns {Promise<*>}
   */
  async execute() {
    throw new Error('Not implemented');
  }
}

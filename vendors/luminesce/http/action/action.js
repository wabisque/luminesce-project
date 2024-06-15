export default class Action {
  /** @type {import('../../application/application.js')} */
  get _app() {
    return this.#app;
  }
  /** @type {import('../request/request.js').default} */
  get _request() {
    return this.#request;
  }
  /** @type {import('../../application/application.js')} */
  #app;
  /** @type {import('../request/request.js').default} */
  #request;

  /**
   * @returns {Promise<import('../response/response.js').default}
   */
  async execute() {
    throw new Error('Not implemented');
  }
}

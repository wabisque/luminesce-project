export default class Command {
  /** @type {string} */
  static get tag() {
    throw new Error('Not implemented');
  }

  /** @type {import('../application/application.js').default} */
  get _app() {
    return this.#app;
  }

  /** @type {Record<string, (string|string[])?>} */
  _args;
  /** @type {import('../application/application.js').default} */
  #app;

  /**
   * @param {import('../application/application.js').default} app
   * @param {Record<string, (string|string[])?>} args
   */
  constructor(app, args) {
    this.#app = app;
    this._args = args;
  }

  /** 
   * @returns {Promise<string>}
   */
  async execute() {
    throw new Error('Not implemented');
  }
}

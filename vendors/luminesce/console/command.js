export default class Command {
  /** @type {string} */
  static get tag() {
    return '';
  }

  /** @type {import('../application/application.js').default} */
  _app;
  /** @type {Record<string, (string|string[])?>} */
  _args;

  /**
   * @param {import('../application/application.js').default} app
   * @param {Record<string, (string|string[])?>} args
   */
  constructor(app, args) {
    this._app = app;
    this._args = args;
  }

  /** 
   * @returns {Promise<string>}
   */
  async execute() {
    throw new Error('Not implemented');
  }
}

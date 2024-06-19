import bcryptjs from 'bcryptjs';

export default class Hasher {
  /** @type {import('../application/application.js').default} */
  #app;

  /**
   * @param {import('../application/application.js').default} app
   */
  constructor(app) {
    this.#app = app;
  }

  /**
   * @param {string} value
   * @param {string} hashed
   * @returns {Promise<bool>}
   */
  async check(value, hashed) {
    return await bcryptjs.compare(value, hashed);
  }

  /**
   * @param {string} value
   * @returns {Promise<string>}
   */
  async make(value) {
    return await bcryptjs.hash(value, this.#app.config.get('hashing.rounds'));
  }
}

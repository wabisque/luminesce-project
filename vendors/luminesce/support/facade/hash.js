import Facade from './facade.js';

export default class Hash extends Facade {
  /**
   * @param {string} value
   * @param {string} hashed
   * @returns {Promise<bool>}
   */
  static async check(value, hashed) {
    return await this._app.hasher.check(value, hashed);
  }

  /**
   * @param {string} value
   * @returns {Promise<string>}
   */
  static async make(value) {
    return await this._app.hasher.make(value);
  }
}

import bcryptjs from 'bcryptjs';

import Facade from './facade.js';

export default class Hash extends Facade {
  /**
   * @param {string} value
   * @param {string} hashed
   * @returns {Promise<bool>}
   */
  static async check(value, hashed) {
    return await bcryptjs.compare(value, hashed);
  }

  /**
   * @param {string} value
   * @returns {Promise<string>}
   */
  static async make(value) {
    return await bcryptjs.hash(value, this._app.config.get('hashing.rounds'));
  }
}

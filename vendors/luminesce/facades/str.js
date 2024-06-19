import StrUtility from '../utilities/str.js';
import Facade from './facade.js';

export default class Str extends Facade {
  static get #str() {
    return new StrUtility();
  }

  /**
   * @param {number} [length]
   * @returns {string}
   */
  static random(length = 16) {
    return this.#str.random(length);
  }
}

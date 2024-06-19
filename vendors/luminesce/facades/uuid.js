import UuidUtility from '../utilities/uuid.js';
import Facade from './facade.js';

export default class Uuid extends Facade {
  /** @type {UuidUtility} */
  static get #uuid() {
    return new UuidUtility();
  }

  /**
   * @returns {Uint8Array}
   */
  static make() {
    return this.#uuid.make();
  }

  /**
   * @param {string} string
   * @returns {Uint8Array}
   */
  static parse(string) {
    return this.#uuid.parse(string);
  }

  /**
   * 
   * @param {Uint8Array} buffer
   * @returns {string}
   */
  static stringify(buffer) {
    return this.#uuid.stringify(buffer);
  }
}

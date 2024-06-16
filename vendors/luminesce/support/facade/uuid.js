import { v4, parse, stringify } from 'uuid';

import Facade from './facade.js';

export default class Uuid extends Facade {
  /**
   * @returns {Uint8Array}
   */
  static make() {
    return parse(v4());
  }

  /**
   * @param {string} string
   * @returns {Uint8Array}
   */
  static parse(string) {
    return parse(string);
  }

  /**
   * 
   * @param {Uint8Array} buffer
   * @returns {string}
   */
  static stringify(buffer) {
    return stringify(buffer);
  }
}

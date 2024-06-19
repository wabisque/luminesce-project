import { v4, parse, stringify } from 'uuid';

export default class Uuid {
  /**
   * @returns {Uint8Array}
   */
  make() {
    return parse(v4());
  }

  /**
   * @param {string} string
   * @returns {Uint8Array}
   */
  parse(string) {
    return parse(string);
  }

  /**
   * 
   * @param {Uint8Array} buffer
   * @returns {string}
   */
  stringify(buffer) {
    return stringify(buffer);
  }
}

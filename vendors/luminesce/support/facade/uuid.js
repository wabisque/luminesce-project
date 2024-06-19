import Facade from './facade.js';

export default class Uuid extends Facade {
  /**
   * @returns {Uint8Array}
   */
  static make() {
    return this._app.uuid.make();
  }

  /**
   * @param {string} string
   * @returns {Uint8Array}
   */
  static parse(string) {
    return this._app.uuid.parse(string);
  }

  /**
   * 
   * @param {Uint8Array} buffer
   * @returns {string}
   */
  static stringify(buffer) {
    return this._app.uuid.stringify(buffer);
  }
}

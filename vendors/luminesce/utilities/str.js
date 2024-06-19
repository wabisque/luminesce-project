import { randomBytes } from 'node:crypto';

export default class Str {
  /** @type {Str?} */
  static #instance = null;

  constructor() {
    if(Str.#instance != null) {
      return Str.#instance;
    }

    Str.#instance = this;
  }

  /**
   * @param {number} [length]
   * @returns {string}
   */
  random(length = 16) {
    return randomBytes(length)
      .toString('base64')
      .slice(0, 16);
  }
}

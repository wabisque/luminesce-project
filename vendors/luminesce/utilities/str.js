import { pbkdf2Sync, randomBytes } from 'node:crypto';

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
    const salt = randomBytes(length).toString('base64');

    return pbkdf2Sync(
      Date.now().toString(),
      salt,
      1000,
      length,
      'sha512'
    )
      .toString('base64')
      .slice(0, length);
  }
}

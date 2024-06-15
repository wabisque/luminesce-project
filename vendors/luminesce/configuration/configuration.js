import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export default class Configuration {
  /** @type {Record<string, *>} */
  #map = {};

  /**
   * @param {string} key
   * @param {*} [fallback]
   * @returns {*}
   */
  get(key, fallback = null) {
    return key
      .split('.')
      .reduce(
        (previous, current) => previous?.[current],
        this.#map
      ) 
      ?? fallback;
  }

  /**
   * @param {string} path
   * @returns {Promise<void>}
   */
  async load(path) {
    const files = await readdir(path);

    for(const file of files) {
      if(file.endsWith('.js')) {
        const name = file.slice(0, -3);
        const { default: config } = await import(join(path, file));

        this.#map[name] = config;
      }
    }
  }

  /**
   * @param {string} key
   * @param {*} value
   * @returns {void}
   */
  set(key, value) {
    const segments = key.split('.');
    const scope = segments
      .slice(0, -1)
      .reduce(
        (previous, current) => {
          if(typeof previous[current] != 'object' || previous[current] == null) {
            previous[current] = {};
          }

          return previous[current];
        },
        this.#map
      );

    scope[segments.at(-1)] = value;
  }
}

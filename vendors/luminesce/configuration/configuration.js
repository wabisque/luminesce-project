import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export default class Configuration {
  /** @type {import('../application/application.js').default} */
  #app;
  /** @type {Record<string, *>} */
  #map = {};

  /**
   * @param {import('../application/application.js').default} app
   */
  constructor(app) {
    this.#app = app;
  }

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
   * @returns {Promise<void>}
   */
  async setup() {
    const configPath = join(this.#app.basePath, 'config');
    const files = await readdir(configPath);

    for(const file of files) {
      if(file.endsWith('.js')) {
        const name = file.slice(0, -3);
        const path = join(configPath, file);

        const { default: config } = await import(pathToFileURL(path));

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

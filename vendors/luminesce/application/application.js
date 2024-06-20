import { join } from 'node:path';

import SecretsManager from '../../wonder/secrets-manager.js';
import Console from '../console/console.js';
import Connection from '../database/connection.js';
import Router from '../http/routing/router.js';
import Configuration from '../configuration/configuration.js';
import Hasher from '../hashing/hasher.js';

export default class Application {
  /** @type {bool} */
  static get initialized() {
    return Application.#instance != null;
  }

  /** @type {Application?} */
  static #instance = null;

  /** @type {string} */
  get basePath() {
    return this.#basePath;
  }
  /** @type {Configuration} */
  get config() {
    return this.#config;
  }
  /** @type {Console} */
  get console() {
    return this.#console;
  }
  /** @type {Connection} */
  get db() {
    return this.#db;
  }
  /** @type {Hasher} */
  get hasher() {
    return this.#hasher;
  }
  /** @type {bool} */
  get initialized() {
    return Application.initialized;
  }
  /** @type {Router} */
  get router() {
    return this.#router;
  }
  /** @type {SecretsManager} */
  get secrets() {
    return this.#secrets;
  }
  /** @type {string} */
  #basePath;
  /** @type {Configuration} */
  #config;
  /** @type {Console} */
  #console;
  /** @type {Connection} */
  #db;
  /** @type {Hasher} */
  #hasher;
  /** @type {Router} */
  #router;
  /** @type {SecretsManager} */
  #secrets;

  /**
   * @param {string} basePath
   */
  constructor(basePath) {
    if (Application.#instance) {
      return Application.#instance;
    }

    this.#basePath = basePath;

    Application.#instance = this;
  }

  /**
   * @param {import('../http/request/request.js').default} request
   * @returns {Promise<import('../http/response/response.js').default>}
   */
  async execute(request) {
    const match = await this.#router
      .match(request);

    return await match.execute(request);
  }

  /**
   * @returns {Promise<void>}
   */
  async setup() {
    this.#config = new Configuration(this);

    await this.#config.setup();

    this.#secrets = new SecretsManager(this.#config.get('db.secret'));

    this.#console = new Console(this);
    
    this.#db = new Connection(this);

    await this.#db.connect();

    this.#hasher = new Hasher(this);
    
    this.#router = new Router();
  }
}

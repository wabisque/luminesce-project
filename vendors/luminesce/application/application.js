import { join } from 'node:path';

import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

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
    this.#config = new Configuration();

    await this.#config.load(join(this.#basePath, './config'));

    this.#console = new Console(this);

    const database = this.#config.get('db.database');
    const host = this.#config.get('db.host');
    const port = this.#config.get('db.port');
    
    const secretsManager = new SecretsManagerClient();
    const secretResponse = await secretsManager.send(
      new GetSecretValueCommand({
        SecretId: this.#config.get('db.secret'),
      })
    );
    const secrets = JSON.parse(secretResponse.SecretString);

    this.#db = new Connection(
      database,
      host,
      port,
      secrets.username,
      secrets.password
    );

    await this.#db.connect();

    this.#hasher = new Hasher(this);
    
    this.#router = new Router();
  }
}

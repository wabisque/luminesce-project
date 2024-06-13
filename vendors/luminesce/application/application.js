import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

import Connection from '../../admiral/database/connection.js';
import Console from '../console/console.js';

export default class Application {
  /** @type {Application?} */
  static #instance = null;

  /** @type {string} */
  get basePath() {
    return this.#basePath;
  }
  /** @type {Console} */
  get console() {
    return this.#console;
  }
  /** @type {Connection} */
  get db() {
    return this.#db;
  }

  /** @type {string} */
  #basePath;
  /** @type {Console} */
  #console;
  /** @type {Connection} */
  #db;

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
   * @returns {Promise<void>}
   */
  async execute() {
    throw new Error('Not implemented');
  }

  /**
   * @returns {Promise<void>}
   */
  async setup() {
    
    const database = process.env.AWS_SAM_LOCAL == 'true' ? process.env.DB_LOCAL_DATABASE : process.env.DB_DATABASE;
    const host = process.env.AWS_SAM_LOCAL == 'true' ? process.env.DB_LOCAL_HOST : process.env.DB_HOST;
    const port = process.env.AWS_SAM_LOCAL == 'true' ? process.env.DB_LOCAL_PORT : process.env.DB_PORT;
    let username = process.env.DB_LOCAL_USERNAME;
    let password = process.env.DB_LOCAL_PASSWORD;

    if(process.env.AWS_SAM_LOCAL != 'true') {
      const secretsManager = new SecretsManagerClient();
      const secretResponse = await secretsManager.send(
        new GetSecretValueCommand({
          SecretId: process.env.DB_SECRET,
        })
      );1
      const secrets = JSON.parse(secretResponse.SecretString);

      username = secrets.username;
      password = secrets.password;
    }

    this.#console = new Console(this);
    this.#db = new Connection(
      database,
      host,
      port,
      username,
      password
    );

    await this.#db.connect();
  }
}

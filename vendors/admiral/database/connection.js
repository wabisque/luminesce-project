import { createConnection } from 'mysql2/promise.js';

export default class Connection {
  /** @type {string?} */
  #database;
  /** @type {string} */
  #host;
  /** @type {string?} */
  #password;
  /** @type {number} */
  #port;
  /** @type {import('mysql2/promise.js').Connection} */
  #proxy;
  /** @type {string} */
  #username;

  /**
   * 
   * @param {string} host
   * @param {number} port
   * @param {string} username
   * @param {string?} password
   * @param {string?} database
   */
  constructor(database, host, port, username, password = null) {
    this.#database = database;
    this.#host = host;
    this.#port = port;
    this.#username = username;
    this.#password = password;
  }

  /**
   * @returns {Promise<void>}
   */
  async connect() {
    this.#proxy = await createConnection({
      host: this.#host,
      namedPlaceholders: true,
      password: this.#password,
      port: this.#port,
      user: this.#username,
    });
    
    await this.#proxy.connect();
    await this.#proxy.query(`CREATE DATABASE IF NOT EXISTS \`${this.#database}\`;`);
    await this.#proxy.query(`USE \`${this.#database}\`;`);
  }

  /**
   * @return {Promise<void>}
   */
  async disconnect() {
    await this.#proxy.end();
  }

  /**
   * @param {string} command 
   * @param  {Record<string, *>} [options]
   * @returns {Promise<Record<string, *>[]>}
   */
  async execute(command, options = undefined) {
    const [ records ] = await this.#proxy.query(command, options);

    return records;
  }
}

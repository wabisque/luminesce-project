import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

export default class SecretsManager {
  /** @type {SecretsManagerClient} */
  #client;
  /** @type {string} */
  #id;

  /**
   * @param {string} id 
   */
  constructor(id) {
    this.#id = id;
    this.#client = new SecretsManagerClient();
  }

  /**
   * @returns {Promise<Record<string, string>>}
   */
  async get() {
    const command = new GetSecretValueCommand({
      SecretId: this.#id,
    });
    const response = await this.#client.send(command);

    return JSON.parse(response.SecretString);
  }
}

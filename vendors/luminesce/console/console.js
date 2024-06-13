export default class Console {
  /** @type {import('../application/application.js').default} */
  #app;
  /** @type {typeof import('./command.js').default[]} */
  #commands = [];

  /**
   * @param {import('../application/application.js').default} app
   */
  constructor(app) {
    this.#app = app;
  }

  /**
   * @param {typeof import('./command.js').default} commandCtor
   * @returns {void}
   */
  register(commandCtor) {
    if(this.#commands.some(registered => registered.tag == commandCtor.tag)) {
      throw new Error(`Command with tag ${commandCtor.tag} already registered.`);
    }

    this.#commands.push(commandCtor);
  }

  /**
   * @param {string} command
   * @param {Record<string, (string|string[])?>} args
   * @returns {Promise<void>}
   */
  async execute(command, args) {
    const ctor = this.#commands.find(ctor => ctor.tag == command);

    if(!ctor) {
      throw new Error(`Command with tag ${command} not found.`);
    }

    const instance = new ctor(this.#app, args);
    const message = await instance.execute();

    if(message != null) {
      console.log(`INFO — ${message}`);
    }
  }
}

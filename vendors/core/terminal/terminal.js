export default class Terminal {
  /**
   * @type {Terminal}
   */
  static #instance;

  get basePath() {
    return this.#basePath;
  }

  #basePath;
  /**
   * @type {typeof import('./command.js').default[]}
   */
  #commands = [];

  /**
   * @param {string} basePath
   */
  constructor(basePath) {
    if(Terminal.#instance) {
      return Terminal.#instance;
    }

    this.#basePath = basePath

    Terminal.#instance = this;
  }

  /**
   * @param {string} tag
   * @param {string[]} args
   */
  async command(tag, args) {
    const ctor = this.#fetch(tag);
    const command = new ctor(this, args);

    await command.execute();
  }

  /**
   * @param {typeof import('./command.js').default} command
   */
  register(command) {
    if(this.#commands.includes(command)) {
      console.log(`\x1b[37m\x1b[41m ERROR \x1b[0m Command \x1b[1m[${command.tag}]\x1b[0m already registered.`);

      throw new Error(`Command [${command.tag}] already registered.`);
    }

    this.#commands.push(command);
  }

  /**
   * @param {string} tag
   */
  #fetch(tag) {
    const ctor = this.#commands.find(command => command.tag === tag);

    if(ctor == null) {
      console.log(`\x1b[37m\x1b[41m ERROR \x1b[0m Command not \x1b[1m[${tag}]\x1b[0m found.`);

      throw new Error(`Command not [${tag}] found.`);
    }

    return ctor;
  }
}

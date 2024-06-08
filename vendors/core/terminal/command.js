/**
 * @abstract
 */
export default class Command {
  static get tag() {
    throw new Error('Not implemented');
  }

  _args;
  _terminal;

  /**
   * @param {import('./terminal.js').Terminal} terminal
   * @param {string[]} args
   */
  constructor(terminal, args = []) {
    this._terminal = terminal;
    this._args = args;
  }

  async execute() {
    throw new Error('Not implemented');
  }
}

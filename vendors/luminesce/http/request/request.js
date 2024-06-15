export default class Request {
  /** @type {string} */
  get path() {
    return this.#path;
  }
  /** @type {import('../routing/route-match.js').default} */
  get match() {
    if(this.#match == null) {
      throw new Error('Match not set.');
    }
    return this.#match;
  }
  /** 
   * @param {import('../routing/route-match.js').default} value
   */
  set match(value) {
    if(this.#match != null) {
      throw new Error('Match already set.');
    }

    this.#match = value;
  }
  /** @type {'get'|'post'|'put'|'delete'|'options'} */
  get method() {
    return this.#method;
  }
  /** @type {string} */
  #path;
  /** @type {import('../routing/route-match.js').default} */
  #match;
  /** @type {'get'|'post'|'put'|'delete'|'options'} */
  #method;

  /**
   * @param {'get'|'post'|'put'|'delete'|'options'} method
   * @param {string} path
   */
  constructor(method, path) {
    this.#method = method;
    this.#path = path;
  }
}

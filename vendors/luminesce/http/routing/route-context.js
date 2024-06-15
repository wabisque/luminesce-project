export default class RouteContext {
  /** @type {RouteContext?} */
  static #instance = null;

  /** @type {Record<string, typeof import('./route-binding.js').default} */
  get bindings() {
    const bindings = {};

    for(const stack of this.#stacks) {
      for(const key in stack.bindings) {
        bindings[key] = stack.bindings[key];
      }
    }

    return bindings;
  }
  /** @type {typeof import('../middleware/middleware.js').default[]} */
  get middleware() {
    const middleware = [];

    for(const stack of this.#stacks) {
      middleware.push(...stack.middleware);
    }

    return middleware;
  }
  /** @type {string} */
  get path() {
    const path = [];

    for(const stack of this.#stacks) {
      path.push(stack.path);
    }

    return path.join('/');
  }
  /** @type {import('./route-context-stack.js').default[]} */
  #stacks = [];

  constructor() {
    if(RouteContext.#instance) {
      return RouteContext.#instance;
    }

    return RouteContext.#instance = this;
  }

  /**
   * @returns {void}
   */
  pop() {
    this.#stacks.pop();
  }

  /**
   * @param {import('./route-context-stack.js').default} stack
   * @returns {void}
   */
  push(stack) {
    this.#stacks.push(stack);
  }
}

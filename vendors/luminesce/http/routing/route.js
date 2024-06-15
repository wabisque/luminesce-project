import RouteMatch from './route-match.js';

export default class Route {
  /**
   * @param {Record<string, typeof import('./route-binding.js').default>} value
   */
  set bindings(value) {
    for(const key in value) {
      this.#bindings[key] = value[key];
    }
  }
  /** @type {('get'|'post'|'put'|'delete'|'options')[]} */
  get methods() {
    return this.#methods;
  }
  /**
   * @param {typeof import('../middleware/middleware.js').default[]} value
   */
  set middleware(value) {
    this.#middleware.push(...value);
  }
  /** @type {string} */
  get path() {
    return this.#path;
  }
  /** @type {import('../action/action.js').default} */
  #action;
  /** @type {import('../../application/application.js').default} */
  #app;
  /** @type {Record<string, typeof import('./route-binding.js').default>} */
  #bindings;
  /** @type {('get'|'post'|'put'|'delete'|'options')[]} */
  #methods;
  /** @type {typeof import('../middleware/middleware.js').default[]} */
  #middleware;
  /** @type {string} */
  #path;

  /**
   * @param {import('../../application/application.js').default} app 
   * @param {('get'|'post'|'put'|'delete'|'options')[]} methods 
   * @param {string} path 
   * @param {import('../action/action.js').default} action 
   * @param {typeof import('../middleware/middleware.js').default[]} [middleware] 
   * @param {Record<string, typeof import('./route-binding.js').default>} [bindings]
   */
  constructor(app, methods, path, action, middleware = [], bindings = {}) {
    this.#app = app;
    this.#path = `/${
      path
        .split('/')
        .filter(Boolean)
        .join('/')
    }`;
    this.#methods = methods;
    this.#action = action;
    this.#middleware = middleware;
    this.#bindings = bindings;
  }

  /**
   * @param {import('../request/request.js').default} request
   * @return {Promise<import('../response/response.js').default>}
   */
  async execute(request) {
    for(const middleware of this.#middleware) {
      const instance = new middleware(this.#app, request);

      await instance.execute();
    }

    const instance = new this.#action(this.#app, request);

    return await instance.execute();
  }

  /**
   * @param {import('../request/request.js').default} request
   * @returns {Promise<RouteMatch?>}
   */
  async match(request) {
    const segments = this.#path
      .split('/')
      .filter(Boolean)
      .map(segment => {
        if(/^:[A-Za-z_$][A-Za-z\d_$]*$/g.test(segment)) {
          return `(?<${segment.slice(1)}>[^\\/]+)`;
        }

        return segment.replace(/[.*+?^$\{\}\(\)\|\[\]\\]/g, '\\$&');
      });
    const pattern = new RegExp(`^\\/${segments.join('\\/')}$`, 'g');
    const [ match ] = [
      ...request.path.matchAll(pattern),
    ];

    if(match != null && this.#methods.includes(request.method)) {
      const parameters = {};

      for(const key in this.#bindings) {
        const instance = new this.#bindings[key](this.#app, request, match.groups?.[key]);

        parameters[key] = await instance.execute();
      }
      
      return new RouteMatch(this, parameters);
    }

    return null;
  }
}

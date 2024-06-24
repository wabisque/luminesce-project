import { Middleware } from '@dreamitdev/luminesce/http/middleware';

export default class TransformRequestMiddleware extends Middleware {
  /**
   * @type {typeof import('@dreamitdev/luminesce/http/request').Request}
   */
  #ctor;


  /**
   * @param {import('@dreamitdev/luminesce/application/application.js').default} app
   * @param {import('@dreamitdev/luminesce/http/request/request.js').default} request
   * @param {typeof import('@dreamitdev/luminesce/http/request').Request}
   */
  constructor(app, request, ctor) {
    super(app, request);

    this.#ctor = ctor;
  }

  /**
   * @returns {Promise<import('@dreamitdev/luminesce/http/request').Request|import('@dreamitdev/luminesce/http/response').Response|void>}
   */
  async execute() {
    return new this.#ctor(
      this._request.method,
      this._request.path,
      this._request.headers,
      this._request.body,
      this._request.search,
      this._request.match,
    );
  }
}

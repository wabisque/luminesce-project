export default class Response {
  /** @type {string} */
  body;
  /** @type {Record<string, string>} */
  headers;
  /** @type {number} */
  status;

  /**
   * @param {string} [body]
   * @param {Record<string, string>} [headers]
   * @param {number} [status]
   */
  constructor(body = '', headers = [], status = 200) {
    this.body = body;
    this.headers = headers;
    this.status = status;
  }
}

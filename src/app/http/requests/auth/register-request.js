import { Request } from '@dreamitdev/luminesce/http/request';
import Joi from 'joi';

export default class RegisterRequest extends Request {
  /**
   * @param {Request} request
   */
  constructor(request) {
    super(
      request._app,
      request.method,
      request.path,
      request.headers,
      request.body,
      request.search,
      request._match,
    );
  }

  /**
   * @returns {Promise<import('joi').ObjectSchema>}
   */
  async _validation() {
    return Joi.object();
  }
}

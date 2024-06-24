import { Request } from '@dreamitdev/luminesce/http/request';
import Joi from 'joi';

export default class RegisterRequest extends Request {
  /**
   * @returns {Promise<import('joi').ObjectSchema>}
   */
  async _validation() {
    return Joi.object({
      phone: Joi.string().required().pattern(/^[0-9]+$/).min(9).max(16),
      password: Joi.string().required().pattern(/.*[A-Z]+.*/).pattern(/.*[a-z]+.*/).pattern(/.*\d+.*/).pattern(/.*[^A-Za-z\d\s]+.*/).min(8).max(64),
    });
  }
}

import { Action } from '@dreamitdev/luminesce/http/action';
import { Response } from '@dreamitdev/luminesce/http/response';

export default class WelcomeAction {
  /**
   * @returns {Promise<import('@dreamitdev/luminesce/http/response').Response>}
   */
  async execute() {
    return new Response(
      JSON.stringify({
        message: 'Welcome to the Luminesce API!',
      }),
      {
        'content-type': 'application/json',
      }
    );
  }
}

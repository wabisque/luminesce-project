import { Action } from '@dreamitdev/luminesce/http/action';
import { Response } from '@dreamitdev/luminesce/http/response';

export default class RegisterAction extends Action {
  /**
   * @returns {Promise<Response>}
   */
  async execute() {
    return new Response(
      `Hello world from \`RegisterAction\`!`,
      {
        'Content-Type': 'text/plain',
      }
    );
  }
}

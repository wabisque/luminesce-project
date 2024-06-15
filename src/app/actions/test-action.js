import Action from '../../../vendors/luminesce/http/action/action.js';
import Response from '../../../vendors/luminesce/http/response/response.js';

export default class TestAction extends Action {
  /**
   * @returns {Response}
   */
  async execute() {
    return new Response(
      JSON.stringify({
        status: 'successful',
        message: 'Test executed successfully.',
        data: {
          message: 'Hello world!',
        },
      }),
      {
        'Content-Type': 'application/json',
      }
    );
  }
}

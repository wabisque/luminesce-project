import Action from '../../../vendors/luminesce/http/action/action.js';
import Response from '../../../vendors/luminesce/http/response/response.js';
import Hash from '../../../vendors/luminesce/support/facade/hash.js';

export default class TestAction extends Action {
  /**
   * @returns {Response}
   */
  async execute() {
    const hash = await Hash.make('password');
    
    return new Response(
      JSON.stringify({
        status: 'successful',
        message: 'Test executed successfully.',
        data: {
          message: 'Hello world!',
          hash,
        },
      }),
      {
        'Content-Type': 'application/json',
      },
    );
  }
}

import Str from '../../../vendors/luminesce/facades/str.js';
import Action from '../../../vendors/luminesce/http/action/action.js';
import Response from '../../../vendors/luminesce/http/response/response.js';
import Hash from '../../../vendors/luminesce/facades/hash.js';
import Uuid from '../../../vendors/luminesce/facades/uuid.js';

export default class TestAction extends Action {
  /**
   * @returns {Response}
   */
  async execute() {
    const hash = await Hash.make('password');
    const uuid = Uuid.make();
    const uuidString = Uuid.stringify(uuid);
    const randomString = Str.random();
    
    return new Response(
      JSON.stringify({
        status: 'successful',
        message: 'Test executed successfully.',
        data: {
          message: 'Hello world!',
          hash,
          uuid,
          uuidString,
          randomString,
        },
      }),
      {
        'Content-Type': 'application/json',
      },
    );
  }
}

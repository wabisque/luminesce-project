import { Hash, Str, Uuid } from '@dreamitdev/luminesce/facades';
import { Action } from '@dreamitdev/luminesce/http/action';
import { Response } from '@dreamitdev/luminesce/http/response';

export default class TestAction extends Action {
  /**
 * @returns {Promise<Response>}
   */
  async execute() {
    const hash = await Hash.make('password');
    const uuid = Uuid.make();
    const uuidString = Uuid.stringify(uuid);
    const randomString = Str.random(1000);
    
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
          randomStringLength: randomString.length,
        },
      }),
      {
        'Content-Type': 'application/json',
      },
    );
  }
}

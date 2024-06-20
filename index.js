import Request from './vendors/luminesce/http/request/request.js';

export async function app(event) {
  // return {
  //   statusCode: 200,
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     env: process.env,
  //     event,
  //     context,
  //   }),
  // };

  const request = new Request(event.httpMethod.toLocaleLowerCase(), event.path);
  const { default: app } = await import('./src/bootstrap/app.js');

  try {
    const response = await app.execute(request);

    return {
      statusCode: response.status,
      headers: response.headers,
      body: response.body,
    };
  } catch(error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: error.stack,
    };
  }
}

export async function console(event) {
  const { default: app } = await import('./src/bootstrap/app.js');

  await app.console.execute(event.command, event.args);
}

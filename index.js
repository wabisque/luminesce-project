import { stringify } from 'node:querystring';

import { Request } from '@dreamitdev/luminesce/http/request';

export async function app(event) {
  const { default: app } = await import('./src/bootstrap/app.js');

  const request = new Request(
    app,
    event.httpMethod.toLocaleLowerCase(),
    event.path,
    event.headers,
    event.isBase64Encoded ? Buffer.from(event.body ?? '', 'base64').toString() : (event.body ?? ''),
    stringify(event.multiValueQueryStringParameters)
  );

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

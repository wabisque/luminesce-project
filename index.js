import { stringify } from 'node:querystring';

import { Request } from '@dreamitdev/luminesce/http/request';

if(process.env.AWS_SAM_LOCAL == 'true') {
  process.env.DB_DATABASE = 'appkeep-api-local';
}

export async function executeApp(event) {
  try {
    const { default: app } = await import('./src/bootstrap/app.js');

    const request = new Request(
      event.httpMethod.toLocaleLowerCase(),
      event.path,
      event.headers,
      event.isBase64Encoded ? Buffer.from(event.body ?? '', 'base64').toString() : (event.body ?? ''),
      stringify(event.multiValueQueryStringParameters)
    );

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

export async function executeConsole(event) {
  const { default: app } = await import('./src/bootstrap/app.js');

  await app.console.execute(event.command, event.args);
}

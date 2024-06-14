export async function app(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      env: process.env,
      event,
      context,
    }),
  };
}

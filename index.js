export async function app(event, context) {
  const { default: handler } = await import('./app.js');

  return await handler(event, context);
}

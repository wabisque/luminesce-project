import { join } from 'node:path';

import { Application } from '@dreamitdev/luminesce/application';

const app = new Application(join(import.meta.dirname, '..'));

await app.setup();

await import('../routes/api.js');
await import('../routes/console.js');

export default app;

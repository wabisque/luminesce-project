import { join } from 'node:path';

import { Application } from '@dreamitdev/luminesce/application';
import { Router } from '@dreamitdev/luminesce/facades';

const app = new Application(join(import.meta.dirname, '..'));

await app.setup();

await import('../helpers/functions.js');

await Router.prefix('api').group(() => import('../routes/api.js'));

await import('../routes/web.js');
await import('../routes/console.js');

export default app;

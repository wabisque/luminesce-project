import { join } from 'node:path';

import Application from '../../vendors/luminesce/application/application.js';

const app = new Application(join(import.meta.dirname, '..'));

await app.setup();

export default app;

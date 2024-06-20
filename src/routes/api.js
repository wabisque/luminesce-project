import { Router } from '@dreamitdev/luminesce/facades';

import TestAction from '../app/http/actions/test-action.js';

Router.get('/', TestAction);

import { Router } from '@dreamitdev/luminesce/facades';
import WelcomeAction from '../app/http/actions/welcome-action.js';

Router.get('/', WelcomeAction);

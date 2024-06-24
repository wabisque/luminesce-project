import { Router } from '@dreamitdev/luminesce/facades';
import { MiddlewareBuilder } from '@dreamitdev/luminesce/http/middleware';

import RegisterAction from '../app/http/actions/auth/register-action.js';
import TransformRequestMiddleware from '../app/http/middleware/transform-request-middleware.js';
import RegisterRequest from '../app/http/requests/auth/register-request.js'

Router.prefix('auth').group(() => {
  Router
    .post('register', RegisterAction)
    .middleware(new MiddlewareBuilder(
      TransformRequestMiddleware,
      RegisterRequest
    ));
});

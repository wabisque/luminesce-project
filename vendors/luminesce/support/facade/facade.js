import Application from '../../application/application.js';

export default class Facade {
  static get _app() {
    if(Application.initialized) {
      return new Application();
    }

    throw new Error('Application not initialized.');
  }
}

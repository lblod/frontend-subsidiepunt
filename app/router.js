import EmberRouter from '@ember/routing/router';
import { macroCondition, getOwnConfig } from '@embroider/macros';
import config from 'frontend-subsidie-loket/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');
  this.route('switch-login');
  this.route('mock-login');

  this.route('auth', { path: '/authorization' }, function () {
    this.route('callback');
    this.route('login');
    this.route('logout');
    this.route('switch');
  });

  this.route('contact');

  this.route('legaal', function () {
    this.route('disclaimer');
    this.route('cookieverklaring');
    this.route('toegankelijkheidsverklaring');
  });

  this.route('bbcdr', function () {
    this.route('rapporten', function () {
      this.route('new');
      this.route('edit', { path: '/:id' });
    });
  });

  this.route('toezicht', function () {
    this.route('inzendingen', function () {
      this.route('new');
      this.route('edit', { path: '/:id' });
    });
  });

  this.route('berichtencentrum', function () {
    this.route('berichten', function () {
      this.route('conversatie', { path: '/:id' }, function () {});
      if (macroCondition(getOwnConfig().controle)) {
        this.route('new');
      }
    });
  });

  this.route('subsidy', function () {
    this.route('applications', function () {
      this.route('available-subsidies');
      this.route('new');
      this.route('edit', { path: '/:id' }, function () {
        this.route('step', { path: '/steps/:step_id' }, function () {
          this.route('new');
          this.route('edit', { path: '/forms/:form_id' });
        });
      });
    });
  });

  this.route(
    'lpdc-external-redirect',
    { path: '/producten-en-dienstencatalogus' },
    function () {
      // We need the child routes since `/producten-en-dienstencatalogus/*` won't match the case without a subpath
      // By using an index and named route with a path we work around that issue. The lpdc-external-redirect route
      // then retrieves the needed data from the transition object.
      this.route('with-path', { path: '/*path' });
    }
  );

  this.route('route-not-found', {
    path: '/*wildcard',
  });
});

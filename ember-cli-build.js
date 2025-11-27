'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = async function (defaults) {
  const { setConfig } = await import('@warp-drive/build-config');

  const app = new EmberApp(defaults, {
    // This is needed when `staticEmberSource` is enabled
    'ember-fetch': {
      preferNative: true,
      nativePromise: true,
    },
    'ember-simple-auth': {
      useSessionSetupMethod: true,
    },
    'ember-test-selectors': {
      strip: false,
    },
    '@lblod/ember-submission-form-fields': {
      helpTextBelowLabel: true,
    },
    babel: {
      plugins: [
        require.resolve('ember-concurrency/async-arrow-task-transform'),
      ],
    },
  });

  setConfig(app, __dirname, {
    deprecations: {
      DEPRECATE_STORE_EXTENDS_EMBER_OBJECT: false,
    },
  });
  // Uncomment this if you want a "classic build"
  // return app.toTree();
  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    staticEmberSource: true,
    splitAtRoutes: ['mock-login'],
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};

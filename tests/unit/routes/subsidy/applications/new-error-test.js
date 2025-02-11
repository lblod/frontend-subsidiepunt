import { module, test } from 'qunit';
import { setupTest } from 'frontend-subsidiepunt/tests/helpers';

module('Unit | Route | subsidy/applications/new-error', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:subsidy/applications/new-error');
    assert.ok(route);
  });
});

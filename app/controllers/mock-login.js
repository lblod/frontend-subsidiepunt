import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { restartableTask, task, timeout } from 'ember-concurrency';

export default class MockLoginController extends Controller {
  @service store;

  queryParams = ['organisatie', 'page'];
  @tracked model;
  @tracked organisatie = '';
  @tracked page = 0;
  size = 10;

  @task
  *queryStore() {
    const filter = { provider: 'https://github.com/lblod/mock-login-service' };
    if (this.organisatie) {
      filter.gebruiker = { organizations: this.organisatie };
    }
    const accounts = yield this.store.query('account', {
      include: 'gebruiker,gebruiker.organizations',
      filter: filter,
      page: { size: this.size, number: this.page },
      sort: 'gebruiker.achternaam',
    });
    return accounts;
  }

  @restartableTask
  *updateSearch(value) {
    yield timeout(500);
    this.page = 0;
    this.organisatie = value;

    this.model = yield this.queryStore.perform();
  }
}

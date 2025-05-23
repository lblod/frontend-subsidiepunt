import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { restartableTask, task, timeout } from 'ember-concurrency';

export default class ImpersonateController extends Controller {
  @service impersonation;
  @service router;
  @service store;

  queryParams = ['organisatie', 'page'];
  @tracked model;
  @tracked organisatie = '';
  @tracked page = 0;
  size = 10;

  setup() {
    this.queryStore.perform();
  }

  queryStore = task(async () => {
    const filter = { provider: 'https://github.com/lblod/mock-login-service' };
    if (this.organisatie) {
      filter.gebruiker = { organizations: this.organisatie };
    }
    const accounts = await this.store.query('account', {
      include: 'gebruiker.organizations',
      filter: filter,
      page: { size: this.size, number: this.page },
      sort: 'gebruiker.achternaam',
    });

    this.model = accounts;
  });

  updateSearch = restartableTask(async (event) => {
    await timeout(500);
    this.page = 0;
    this.organisatie = event.target.value;

    await this.queryStore.perform();
  });

  impersonateAccount = task(async (accountId) => {
    await this.impersonation.impersonate(accountId);
    window.location.replace(this.router.urlFor('subsidy.applications'));

  });
}

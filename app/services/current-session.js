import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { setContext, setUser } from '@sentry/ember';
import { loadAccountData } from 'frontend-subsidiepunt/utils/account';
import { SHOULD_ENABLE_SENTRY } from 'frontend-subsidiepunt/utils/sentry';

const ADMIN_ROLE = 'SubsidiepuntAdmin';

export default class CurrentSessionService extends Service {
  @service session;
  @service store;
  @service impersonation;

  @tracked account;
  @tracked user;
  @tracked group;
  @tracked groupClassification;
  @tracked roles = [];

  get isAdmin() {
    let roles = this.roles;
    if (this.impersonation.isImpersonating) {
      roles = this.impersonation.originalRoles || [];
    }
    return roles.includes(ADMIN_ROLE);
  }

  async load() {
    if (this.session.isAuthenticated) {
      await this.impersonation.load();

      let accountId =
        this.session.data.authenticated.relationships.account.data.id;
      this.account = await loadAccountData(this.store, accountId);

      this.user = this.account.gebruiker;
      this.roles = this.session.data.authenticated.data.attributes.roles;

      // We need to do an extra API call here because ACM/IDM users don't seem to have a "bestuurseenheden" relationship in the DB.
      // By fetching the record directly we bypass that issue
      const groupId =
        this.session.data.authenticated.relationships.group.data.id;
      this.group = await this.store.findRecord('organization', groupId, {
        include: 'classificatie',
        reload: true,
      });
      this.groupClassification = await this.group.classificatie;

      this.setupSentrySession();
    }
  }

  setupSentrySession() {
    if (SHOULD_ENABLE_SENTRY) {
      let account;
      let user;
      let group;
      let groupClassification;
      let roles;

      if (this.impersonation.isImpersonating) {
        account = this.impersonation.originalAccount;
        user = account.gebruiker;
        group = this.impersonation.originalGroup;
        groupClassification = group.belongsTo('classificatie').value();
        roles = this.impersonation.originalRoles;
      } else {
        account = this.account;
        user = this.user;
        group = this.group;
        groupClassification = this.groupClassification;
        roles = this.roles;
      }

      setUser({ id: user.id, ip_address: null });
      setContext('session', {
        account: account.id,
        user: user.id,
        group: group.uri,
        groupClassification: groupClassification?.uri,
        roles,
      });
    }
  }
}

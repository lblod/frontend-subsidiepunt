import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { setContext, setUser } from '@sentry/ember';
import config from 'frontend-loket/config/environment';
import { SHOULD_ENABLE_SENTRY } from 'frontend-loket/utils/sentry';

const MODULE = {
  SUBSIDIES: 'LoketLB-subsidies',
  PUBLIC_SERVICES: 'LoketLB-LPDCGebruiker',
  VERENIGINGEN: 'abb_loketverenigingenapp',
};

export default class CurrentSessionService extends Service {
  @service session;
  @service store;

  @tracked account;
  @tracked user;
  @tracked group;
  @tracked groupClassification;
  @tracked roles = [];

  async load() {
    if (this.session.isAuthenticated) {
      let accountId =
        this.session.data.authenticated.relationships.account.data.id;
      this.account = await this.store.findRecord('account', accountId, {
        include: 'gebruiker',
      });

      this.user = this.account.gebruiker;
      this.roles = this.session.data.authenticated.data.attributes.roles;

      let groupId = this.session.data.authenticated.relationships.group.data.id;
      this.group = await this.store.findRecord('bestuurseenheid', groupId, {
        include: 'classificatie',
        reload: true,
      });
      this.groupClassification = await this.group.classificatie;

      this.setupSentrySession();
    }
  }

  setupSentrySession() {
    if (SHOULD_ENABLE_SENTRY) {
      setUser({ id: this.user.id, ip_address: null });
      setContext('session', {
        account: this.account.id,
        user: this.user.id,
        group: this.group.uri,
        groupClassification: this.groupClassification.uri,
        roles: this.roles,
      });
    }
  }

  canAccess(role) {
    return this.roles.includes(role);
  }

  get canAccessSubsidies() {
    return this.canAccess(MODULE.SUBSIDIES);
  }

  get canAccessPublicServices() {
    return (
      this.canAccess(MODULE.PUBLIC_SERVICES) && !config.lpdcUrl.startsWith('{{')
    );
  }

  get canAccessVerenigingen() {
    return (
      this.canAccess(MODULE.VERENIGINGEN) &&
      !config.verenigingenUrl.startsWith('{{')
    );
  }
}

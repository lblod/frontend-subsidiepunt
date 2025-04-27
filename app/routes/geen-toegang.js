import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class GeenToegangRoute extends Route {
  @service currentSession;
  @service router;
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
    const hasSubsidiepuntGebruikerRole = this.currentSession.roles.includes("SubsidiepuntGebruiker");

    if (hasSubsidiepuntGebruikerRole) {
      this.router.transitionTo('subsidy.applications');
    }
  }
}

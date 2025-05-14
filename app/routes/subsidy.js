import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SubsidyRoute extends Route {
  @service session;
  @service currentSession;
  @service router;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    // Check if user has required role
    if (this.session.isAuthenticated) {
      const hasRequiredRole = this.currentSession.roles.includes("SubsidiepuntGebruiker");
      const hasRequiredRole = this.currentSession.roles.includes(
        'SubsidiepuntGebruiker',
      ) || this.currentSession.roles.includes(
        'SubsidiepuntAdmin',
      );

      if (!hasRequiredRole) {
        this.router.transitionTo('geen-toegang');
        return;
      }
    }
  }
}

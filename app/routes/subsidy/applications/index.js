/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import isFeatureEnabled from 'frontend-subsidiepunt/helpers/is-feature-enabled';
import { ROLES } from 'frontend-subsidiepunt/models/participation';

export default class SubsidyApplicationsIndexRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service currentSession;
  @service store;
  @service router;
  static ECONOMISCHE_ACTOR =
    'http://data.lblod.info/id/concept/c6157470-9fb3-4e8d-a9b7-8737dbfa3642'; //economische actor uuid

  modelName = 'subsidy-measure-consumption';

  beforeModel() {
    if (
      isFeatureEnabled('verenigingenUnderConstruction') &&
      this.currentSession.groupClassification.uri ===
        this.constructor.ECONOMISCHE_ACTOR
    ) {
      this.router.replaceWith('under-construction');
    }
  }

  mergeQueryOptions() {
    let groupId = this.currentSession.group.id;
    return {
      include: [
        'status',
        'subsidy-measure-offer',
        'subsidy-application-forms',
        'subsidy-application-flow.subsidy-measure-offer-series.period',
        'active-subsidy-application-flow-step.subsidy-procedural-step.period',
        'participations',
        'last-modifier',
      ].join(','),
      filter: {
        participations: {
          'participating-bestuurseenheid': {
            id: groupId,
          },
          ':exact:role': ROLES.APPLICANT,
        },
      },
    };
  }
}

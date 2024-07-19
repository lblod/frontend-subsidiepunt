/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { ROLES } from 'frontend-subsidiepunt/models/participation';

export default class SubsidyApplicationsIndexRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service currentSession;
  @service store;

  modelName = 'subsidy-measure-consumption';

  mergeQueryOptions() {
    let groupId = this.currentSession.group.id;
    console.log('groupId', groupId);
    const res =  {
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
          'participating-organization': {
            id: groupId,
          },
          ':exact:role': ROLES.APPLICANT,
        },
      },
    };
    console.log('res', res);
    return res;
  }
}

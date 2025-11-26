/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import isOldFusieAccount from 'frontend-subsidiepunt/helpers/is-old-fusie-account';

export default class SubsidyApplicationsAvailableSubsidiesRoute extends Route.extend(
  DataTableRouteMixin,
) {
  @service session;
  @service currentSession;
  @service store;
  @service router;

  modelName = 'subsidy-measure-offer-series';

  // To mimic user testing as much as possible
  // we introduce testMode queryparam, which skips some of the (blocking) frontend business logic.
  // Note: Re-definition of the params specified by the mixin, since I didn't find a way to merge params from both sources.
  queryParams = {
    testMode: { refreshModel: true },
    filter: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  beforeModel() {
    if (
      isOldFusieAccount(
        this.session.data.authenticated.relationships.group.data.id,
      )
    ) {
      this.router.replaceWith('subsidy.applications');
    }
  }

  mergeQueryOptions(params) {
    const query = {
      include: [
        'period',
        'subsidy-measure-offer',
        'active-application-flow.first-application-step.subsidy-procedural-step',
      ].join(','),
    };

    if (params.testMode) {
      return query;
    } else {
      // Add extra rules to available subsidies
      const today = new Date();

      query[
        'filter[active-application-flow][first-application-step][subsidy-procedural-step][period]'
      ] = {
        ':lte:begin': today.toISOString(),
        ':gte:end': today.toISOString(),
      };

      query[
        'filter[subsidy-measure-offer][criteria][requirement-groups][criterion-requirements][:exact:is-satisfiable-by]'
      ] = this.currentSession.groupClassification.uri;

      return query;
    }
  }
}

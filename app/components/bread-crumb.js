import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class BreadCrumbComponent extends Component {
  @service router;

  get currentRoute() {
    return this.router.currentRouteName;
  }

  bread = [
    {
      route: 'subsidy.applications.index',
      crumbs: [{ label: 'Subsidiebeheer' }],
    },
    {
      route: 'subsidy.applications.available-subsidies',
      crumbs: [{ label: 'Beschikbare subsidiemaatregelen' }],
    },
    {
      route: 'subsidy.applications.edit',
      crumbs: [{ label: 'Bekijk subsidieaanvraag' }],
    },
    {
      route: 'subsidy.applications.edit.step',
      crumbs: [{ label: 'Bekijk subsidieaanvraag' }],
    },
    {
      route: 'subsidy.applications.edit.step.new_error',
      crumbs: [{ label: 'Bekijk subsidieaanvraag' }],
    },
    {
      route: 'subsidy.applications.edit.step.edit',
      crumbs: [{ label: 'Bekijk subsidieaanvraag' }],
    },
  ];

  get crumbsForRoute() {
    const results = this.bread.filter(
      (value) => value.route === this.router.currentRouteName,
    );
    if (results.length <= 0) return [];
    return results[0].crumbs;
  }
}

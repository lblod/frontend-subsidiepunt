import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service() session;
  @service() currentSession;
  @service() router;

  appTitle = 'SubsidiePunt';

  get isIndexOrLoading() {
    return (
      this.router.currentRouteName === 'subsidy.applications.index' ||
      this.router.currentRouteName === 'subsidy.applications.index_loading'
    );
  }
}

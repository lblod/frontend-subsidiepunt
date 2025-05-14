import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service session;
  @service currentSession;
  @service router;
  @service impersonation;

  appTitle = 'SubsidiePunt';

  get isExcludedOrLoading() {
    return (
      this.router.currentRouteName === 'subsidy.applications.index' ||
      this.router.currentRouteName === 'geen-toegang' ||
      this.router.currentRouteName === 'subsidy.applications.index_loading'
    );
  }

  get userInfo() {
    let user;
    let group;
    let classification;

    if (this.impersonation.isImpersonating) {
      user = this.impersonation.originalAccount.gebruiker;
      group = this.impersonation.originalGroup;
      classification = group.belongsTo('classificatie').value();
    } else {
      user = this.currentSession.user;
      group = this.currentSession.group;
      classification = this.currentSession.groupClassification;
    }

    if (!user) {
      return '';
    }

    let userInfo = user.fullName;
    let groupInfo = '';

    if (classification?.label) {
      groupInfo += classification.label;
    }

    if (group?.naam) {
      groupInfo += ` ${group.naam}`;
    }

    groupInfo.trim();

    if (groupInfo.length) {
      userInfo += ` - ${groupInfo}`;
    }

    return userInfo;
  }
}

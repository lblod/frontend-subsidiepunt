import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { loadAccountData } from 'frontend-subsidiepunt/utils/account';

export default class ImpersonationService extends Service {
  @service store;
  @tracked originalAccount;
  @tracked originalGroup;
  @tracked originalRoles;

  get isImpersonating() {
    return Boolean(this.originalAccount);
  }

  async load() {
    try {
      const response = await fetch('/impersonations/current');

      if (response.ok) {
        const result = await response.json();

        const originalAccountId =
          result.data.relationships['original-account'].data.id;
        const originalGroupId =
          result.data.relationships['original-session-group'].data.id;

        const [originalAccount, originalGroup] = await Promise.all([
          loadAccountData(this.store, originalAccountId),
          this.store.findRecord('organization', originalGroupId, {
            include: 'classificatie',
            reload: true,
          }),
        ]);

        this.originalAccount = originalAccount;
        this.originalGroup = originalGroup;
        this.originalRoles = result.data.attributes['original-session-roles'];
      } else {
        console.error(
          'Failed to load impersonation data:',
          response.statusText,
        );
      }
    } catch (error) {
      console.error('Error loading impersonation data:', error);
    }
  }

  async impersonate(accountId) {
    try {
      const response = await fetch('/impersonations', {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify({
          data: {
            type: 'impersonations',
            relationships: {
              impersonates: {
                data: {
                  type: 'accounts',
                  id: accountId,
                },
              },
            },
          },
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        console.error('Impersonate error:', result.errors);
        throw new Error(
          'An exception occurred while trying to impersonate someone: ' +
            JSON.stringify(result.errors),
        );
      }
    } catch (error) {
      console.error('Error during impersonation:', error);
    }
  }

  async stopImpersonation() {
    if (this.isImpersonating) {
      try {
        const response = await fetch('/impersonations/current', {
          method: 'DELETE',
        });

        if (response.ok) {
          this.originalAccount = null;
          this.originalGroup = null;
          this.originalRoles = [];
        } else {
          console.error('Failed to stop impersonation:', response.statusText);
        }
      } catch (error) {
        console.error('Error stopping impersonation:', error);
      }
    }
  }
}

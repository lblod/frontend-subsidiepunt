import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import fetch from 'fetch';
import { action } from '@ember/object';

export default class SubsidyApplicationsEditController extends Controller {
  @service router;

  constructor() {
    super(...arguments);
    window.addEventListener('beforeprint', this.prepareTextareasForPrinting);
  }

  get reeksHasStartOrEnd() {
    return (
      this.consumption.get(
        'subsidyApplicationFlow.subsidyMeasureOfferSeries.period.begin'
      ) ||
      this.consumption.get(
        'subsidyApplicationFlow.subsidyMeasureOfferSeries.period.end'
      )
    );
  }

  get consumption() {
    return this.model.consumption;
  }

  get organization() {
    return this.model.organization;
  }

  get canDelete() {
    return this.model.consumption.get('status.isConcept');
  }
  @action
  exportSubsidyAsPDF() {
    window.print();
  }

  prepareTextareasForPrinting() {
    // Remove any previously created print divs
    const existingPrintDivs = document.querySelectorAll(
      '.textarea, .display-on-print'
    );
    existingPrintDivs.forEach((div) => div.remove());

    // Store original textareas
    const textareas = document.querySelectorAll('textarea');

    // Replace textareas with divs
    textareas.forEach((textarea) => {
      const div = document.createElement('div');
      div.textContent = textarea.value;
      div.style.whiteSpace = 'pre-wrap';
      div.style.border = '1px solid #ccc';
      div.style.padding = '5px';
      div.style.minHeight = `${textarea.offsetHeight}px`;
      div.classList.add('display-on-print');
      div.classList.add('textarea', 'display-on-print');

      textarea.classList.add('au-u-hide-on-print');
      textarea.parentNode.insertBefore(div, textarea);
    });
  }


  @task
  *delete() {
    if (!this.canDelete || !this.consumption.isStable) {
      return;
    }

    try {
      this.consumption.isStable = false;
      /**
       * NOTE: this endpoint prevents the removal of submitted forms, preventing the removal of a consumption all together.
       */
      const forms = yield this.consumption.subsidyApplicationForms;
      for (const form of forms) {
        yield fetch(`/management-application-forms/${form.id}`, {
          method: 'DELETE',
        });
      }

      const participations = yield this.consumption.participations;
      yield Promise.all(
        participations.map((participation) => participation.destroyRecord())
      );

      // We intentionally don't use 'destroyRecord` here since that calls unloadRecord before the
      // transition which causes issues in the ConsumptionStatusPill component
      this.consumption.deleteRecord();
      yield this.consumption.save();
      this.router.transitionTo('subsidy.applications');
      this.consumption.unloadRecord();
    } catch (error) {
      console.log('Removal of consumption failed because:');
      console.error(error);
      // TODO Error handling
    } finally {
      this.consumption.isStable = true;
    }
  }
}

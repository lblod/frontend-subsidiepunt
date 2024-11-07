import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ApplicationFlowStepLinkComponent extends Component {
  @service store;
  @tracked isFormSubmitted = false;

  constructor() {
    super(...arguments);
    this.loadFormStatus();
  }

  async loadFormStatus() {
    let forms = await this.store.query('subsidy-application-form', {
      filter: {
        'subsidy-application-flow-step': {
          ':id:': this.args.currentStep.id,
        },
        'subsidy-measure-consumption': {
          ':id:': this.args.consumption.id,
        },
      },
    });

    const form = forms.at(0);
    if (form) {
      const status = await form.status;
      this.isFormSubmitted = status?.isSent ?? false;
    }
  }

  get isSubmitted() {
    return this.args.activeStep.get('order') == undefined;
  }

  get isActiveStep() {
    return this.args.currentStep.order == this.args.activeStep.get('order');
  }

  // A step is skipped when it's a previous step and the form is not submitted
  get isStepSkipped() {
    console.log('this.', this.isPreviousStep, this.isFormSubmitted);
    return this.isPreviousStep && !this.isFormSubmitted;
  }

  get stepCount() {
    if (this.isPreviousStep || this.isActiveStep || this.isSubmitted)
      return null;
    return this.args.currentStep.order + 1;
  }

  get isFutureStep() {
    return this.args.currentStep.order > this.args.activeStep.get('order');
  }

  get isPreviousStep() {
    // If subsidy is submitted, all the steps are previous
    if (this.isSubmitted) return true;
    return this.args.currentStep.order < this.args.activeStep.get('order');
  }

  get badgeSkin() {
    if (this.isActiveStep) {
      return 'action';
    } else if (this.isFutureStep || this.isStepSkipped) {
      return 'gray';
    } else {
      return 'success'; // Form is skipped
    }
  }

  get icon() {
    if (this.isActiveStep) {
      return 'three-dots';
    } else if (this.isStepSkipped) {
      return 'x';
    } else if (this.isPreviousStep || this.isSubmitted) {
      return 'check';
    } else {
      return '';
    }
  }
}

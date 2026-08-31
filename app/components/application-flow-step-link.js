import Component from '@glimmer/component';

export default class ApplicationFlowStepLinkComponent extends Component {
  get form() {
    const forms = this.args.consumption
      .hasMany('subsidyApplicationForms')
      .value();

    return forms?.find(
      (form) =>
        form.belongsTo('subsidyApplicationFlowStep').id() ===
        this.args.currentStep.id,
    );
  }

  get isFormSubmitted() {
    return this.form?.get('status')?.get('isSent') ?? false;
  }

  get isSubmitted() {
    return this.args.activeStep.get('order') == undefined;
  }

  get isActiveStep() {
    return this.args.currentStep.order == this.args.activeStep.get('order');
  }

  // A step is skipped when it's a previous step and the form is not submitted
  get isStepSkipped() {
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
      return 'redo';
    } else if (this.isPreviousStep || this.isSubmitted) {
      return 'check';
    } else {
      return '';
    }
  }
}

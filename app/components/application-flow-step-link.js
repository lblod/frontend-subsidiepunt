import Component from '@glimmer/component';

export default class ApplicationFlowStepLinkComponent extends Component {
  get isSubmitted() {
    return this.args.activeStep.get('order') == undefined;
  }

  get isActiveStep() {
    return this.args.currentStep.order == this.args.activeStep.get('order');
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
    return this.args.currentStep.order < this.args.activeStep.get('order');
  }

  get badgeSkin() {
    if (this.isActiveStep) {
      return 'action';
    } else if (this.isFutureStep) {
      return 'gray';
    } else {
      return 'success';
    }
  }

  get icon() {
    if (this.isActiveStep) {
      return 'three-dots';
    } else if (this.isPreviousStep || this.isSubmitted) {
      return 'check';
    } else {
      return '';
    }
  }
}

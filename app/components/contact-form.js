import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ContactFormComponent extends Component {
  @tracked selected = null;

  subjectOptions = [
    {
      label: 'Een vraag of probleem over de applicatie',
      subject: 'Vraag of probleem',
    },
  ];

  get canSend() {
    return Boolean(this.selected);
  }

  get mailto() {
    if (this.canSend) {
      let subject = this.selected.subject || this.selected.label;

      return `mailto:LoketLokaalBestuur@vlaanderen.be?subject=${subject} - SubsidiePunt`;
    } else {
      return '';
    }
  }
}

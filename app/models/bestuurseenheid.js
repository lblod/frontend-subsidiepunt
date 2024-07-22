import Model, { attr, belongsTo } from '@ember-data/model';
import OrganizationModel from './organization';

export default class Bestuurseenheid extends OrganizationModel  {
  @attr uri;
  @attr naam;
  @attr alternatieveNaam;
  @attr mailAdres;
  @attr wilMailOntvangen;
  @attr isTrialUser;
  @attr viewOnlyModules;

  @belongsTo('bestuurseenheid-classificatie-code', {
    async: true,
    inverse: null,
  })
  classificatie;
}

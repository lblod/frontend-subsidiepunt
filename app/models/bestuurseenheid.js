import Model, { attr, belongsTo } from '@ember-data/model';

export default class Bestuurseenheid extends Model {
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

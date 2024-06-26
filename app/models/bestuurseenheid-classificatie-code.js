import Model, { attr } from '@ember-data/model';

export default class BestuurseenheidClassificatieCodeModel extends Model {
  @attr label;
  @attr scopeNote;
  @attr uri;
}

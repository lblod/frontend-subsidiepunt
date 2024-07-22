import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class OrganizationModel extends Model {
  @attr naam;

  @belongsTo('organization-classification-code', {
    inverse: null,
    async: true,
    polymorphic: true,
  })
  classificatie;

  @hasMany('identifier', {
    inverse: null,
    async: true,
  })
  identifier;
}

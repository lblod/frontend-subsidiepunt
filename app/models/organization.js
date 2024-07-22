import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class OrganizationModel extends Model {
  @attr naam;
  @attr uri;

  @belongsTo('organization-classification-code', {
    inverse: null,
    async: true,
    polymorphic: true,
  })
  classificatie;

  @hasMany('participation', {
    async: true,
    polymorphic: true,
    inverse: 'participatingOrganization',
  })
  participations;

  @hasMany('identifier', {
    inverse: null,
    async: true,
  })
  identifier;
}

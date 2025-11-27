/* eslint-disable ember/no-mixins */
import JSONAPISerializer from '@ember-data/serializer/json-api';
import DataTableSerializerMixin from 'frontend-subsidiepunt/mixins/ember-data-table/serializer';

export default class ApplicationSerializer extends JSONAPISerializer.extend(
  DataTableSerializerMixin,
) {
  serializeAttribute(snapshot, json, key, attributes) {
    if (key !== 'uri')
      super.serializeAttribute(snapshot, json, key, attributes);
  }
}

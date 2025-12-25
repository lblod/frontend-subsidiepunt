/* eslint-disable ember/classic-decorator-hooks*/
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { ForkingStore } from '@lblod/ember-submission-form-fields';
import { task } from 'ember-concurrency';
import {
  FORM,
  FORM_GRAPHS,
  RDF,
  retrieveFormData,
  retrieveMetaData,
  TEMP_SOURCE_NODE,
} from '../../utils/filter-form-helpers';

export default class SearchQueriesFormComponent extends Component {
  @service store;
  @service router;

  @tracked formStore;
  @tracked sourceNode;

  constructor(form, owner, args) {
    super(owner, args);
    this.init.perform(form);
  }

  get graphs() {
    return FORM_GRAPHS;
  }

  get form() {
    return this.formStore.any(
      undefined,
      RDF('type'),
      FORM('Form'),
      FORM_GRAPHS.formGraph,
    );
  }

  @task
  *init(form) {
    yield this.setupForm(form);
  }

  async setupForm(form) {
    const store = new ForkingStore();
    this.sourceNode = TEMP_SOURCE_NODE;
    await this.retrieveFormData(form, store);
    await this.retrieveMetaData(form, store);
    this.formStore = store;
  }

  async retrieveFormData(uuid, store) {
    await retrieveFormData(`/search-query-forms/${uuid}`, store);
  }

  async retrieveMetaData(uuid, store) {
    await retrieveMetaData(`/search-query-forms/${uuid}/meta`, store);
  }
}

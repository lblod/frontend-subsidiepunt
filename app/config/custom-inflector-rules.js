import Inflector from 'ember-inflector';

const inflector = Inflector.inflector;

inflector.plural(/$/, 'en');
inflector.plural(/e$/, 'es');
inflector.plural(/e([lnr])$/, 'e$1s');
inflector.plural(/([aiuo])$/, '$1s');
inflector.plural(/([^aiuoe])([aiuo])([a-z])$/, '$1$2$3$3en'); // TODO: this is a bit hack
inflector.plural(/uis$/, 'uizen');
inflector.plural(/ief$/, 'ieven');
inflector.plural(/or$/, 'oren');
inflector.plural(/ie$/, 'ies');
inflector.plural(/eid$/, 'eden');
inflector.plural(/aa([a-z])$/, 'a$1en');
inflector.plural(/uu([a-z])$/, 'u$1en');
inflector.plural(/oo([a-z])$/, 'o$1en');
inflector.singular(/en$/, '');
inflector.singular(/es$/, 'e');
inflector.singular(/e([lnr])s$/, 'e$1');
inflector.singular(/([aiuo])s$/, '$1');
inflector.singular(/([^aiuoe])([aiuo])([a-z])\3en$/, '$1$2$3'); // TODO: this is a bit hack
inflector.singular(/uizen$/, 'uis');
inflector.singular(/ieven$/, 'ief');
inflector.singular(/ies$/, 'ie');
inflector.singular(/eden$/, 'eid');
inflector.singular(/a([a-z])en$/, 'aa$1');
inflector.singular(/u([a-z])en$/, 'uu$1');
inflector.singular(/o([a-z])en$/, 'oo$1');
inflector.singular(/([auio])s$/, '$1s');

inflector.irregular('account', 'accounts');
inflector.irregular('file', 'files');
inflector.irregular('remote-url', 'remote-urls');
inflector.irregular('subsidy-application-form', 'subsidy-application-forms');
inflector.irregular(
  'submission-document-status',
  'submission-document-statuses'
);
inflector.irregular('participation', 'participations');
inflector.irregular('organization', 'organizations');
inflector.irregular('period-of-time', 'periods-of-time');
inflector.irregular(
  'subsidy-measure-consumption',
  'subsidy-measure-consumptions'
);
inflector.irregular(
  'subsidy-application-flow-step',
  'subsidy-application-flow-steps'
);
inflector.irregular(
  'subsidy-measure-consumption-status',
  'subsidy-measure-consumption-statuses'
);

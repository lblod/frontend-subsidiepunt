import { Namespace, NamedNode } from 'rdflib';

export const RDF = new Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
export const FORM = new Namespace('http://lblod.data.gift/vocabularies/forms/');
export const SH = new Namespace('http://www.w3.org/ns/shacl#');
export const SEARCH = new Namespace(
  'http://redpencil.data.gift/vocabularies/search-queries/',
);

export const TEMP_SOURCE_NODE = new NamedNode(
  'http://frontend-subsidiedatabank/temp-source-node',
);

export const FORM_GRAPHS = {
  formGraph: new NamedNode('http://data.lblod.info/form'),
  metaGraph: new NamedNode('http://data.lblod.info/metagraph'),
  sourceGraph: new NamedNode(`http://data.lblod.info/sourcegraph`),
};

// API CALLS

export async function retrieveFormData(url, store) {
  let response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'text/turtle' },
  });
  const ttl = await response.text();
  store.parse(ttl, FORM_GRAPHS.formGraph, 'text/turtle');
}

export async function retrieveMetaData(url, store) {
  let response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/n-triples' },
  });
  const ttl = await response.text();
  store.parse(ttl, FORM_GRAPHS.metaGraph, 'text/turtle');
}

// FORM-DATA TO QUERY-PARAMS LOGIC

// TODO generate this based on form-configuration?
export function getQueryParams(options) {
  return {
    subsidieType: options,
    subsidieStatus: options,
    aanvraagDatum: options,
  };
}

/**
 * Converts the data within the store to an Ember query-param object.
 *
 * @param store
 * @param node
 * @returns {{queryParams: {}}}
 */
export function formStoreToQueryParams(store, node) {
  let query = { queryParams: {} };
  // NOTE: retrieve all possible query-params
  const keys = store.match(
    undefined,
    SEARCH('emberQueryParameterKey'),
    undefined,
    FORM_GRAPHS.formGraph,
  );

  if (keys && keys.length) {
    for (let key of keys) {
      const path = store.any(
        key.subject,
        SH('path'),
        undefined,
        FORM_GRAPHS.formGraph,
      );

      const values = store.match(
        node,
        path,
        undefined,
        FORM_GRAPHS.sourceGraph,
      );

      if (values && values.length) {
        query.queryParams[key.object.value] = values
          .map((v) => v.object.value)
          .join(',');
      } else {
        // NOTE: explicitly set value to prevent "sticky" query-params
        query.queryParams[key.object.value] = null;
      }
    }
  }
  return query;
}

export function queryParamsToFormStore(query, store, node) {
  const keys = Object.keys(query || {});
  for (let key of keys) {
    const field = store.any(
      undefined,
      SEARCH('emberQueryParameterKey'),
      key,
      FORM_GRAPHS.formGraph,
    );
    if (field) {
      const path = store.any(
        field,
        SH('path'),
        undefined,
        FORM_GRAPHS.formGraph,
      );
      const values = query[key] && query[key].split(',');
      if (values && values.length) {
        for (let value of values) {
          const rdfv = validURI(value) ? new NamedNode(value) : value;
          store.graph.add(node, path, rdfv, FORM_GRAPHS.sourceGraph);
        }
      }
    }
  }
}

/**
 * Implementation copied over form `submission-form-helpers`
 *
 * @param uri
 */
function validURI(uri) {
  return uri.match(/^(http|ftp)s?:\/\/[\w.-]+\.\w+(\/.*)?/);
}

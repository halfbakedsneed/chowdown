const Promise = require('bluebird');
const { mapValues, first, ary } = require('lodash');

const Query = require('./');

/**
 * When executed, this query will return a promise resolving to
 * an object such that each value of the object is the result
 * of an inner query.
 *
 * @class ObjectQuery
 * @extends Query
 */
class ObjectQuery extends Query {
  /**
   * Constructs an ObjectQuery given an object of queries to execute
   * on a document and an object of additional configuration options.
   * 
   * @param  {object} pick      An object of queries to execute on a given document.
   * @param  {object} [options] An object of additional configuration options.
   */
  constructor(pick, options={}) {
    options.pick = pick;
    super(undefined, options);
  }

  /**
   * Configures the ObjectQuery given an object of configuration options.
   * Non-query pick properties will be wrapped in Query instances.
   * 
   * @param  {object} options      The object of configuration options.
   * @param  {object} options.pick An object of queries to execute on a given document.
   */
  configure(options) {
    super.configure(options);
    this.options.pick = mapValues(this.options.pick, ary(Query.factory, 1));
  }

  /**
   * Finds queries of each pick property in the document.
   * Will return an object where each value is the result of the corresponding pick query.
   * 
   * @param  {Document} document The document to execute each query on.
   * @return {object} An object where each property value is a query promise.
   */
  find(document) {
    return mapValues(this.options.pick, (attr) => attr.on(document));
  }

  /**
   * Constructs a promise from the object such that it is fulfilled when
   * each property's query promise is fulfilled.
   * 
   * @param  {object}   object   The object of resolved query promises.
   * @param  {Doucment} document The document this object was retrieved from.
   * @return {object} A promise that is fulfilled when all the property promises of the object are fulfilled.
   */
  build(object, document) {
    return Promise.props(object);
  }
}

module.exports = ObjectQuery;
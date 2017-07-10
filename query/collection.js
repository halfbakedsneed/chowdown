const Promise = require('bluebird');
const Query = require('./');

/**
 * When executed, this query will return a promise resolving to
 * an array of values such that each value is the result of the inner query
 * executed on each context.
 *
 * @class CollectionQuery
 * @extends Query
 */
class CollectionQuery extends Query {
  /**
   * Constructs a CollectionQuery given a path to a list of contexts
   * and an inner query that describes a value to pick from each context.
   * 
   * Also takes an object of additional configuration options.
   * 
   * @param  {string} path             The path to the contexts in the document.
   * @param  {Query}  inner            A query representing what to pick from each context.
   * @param  {object} [options]        An object of further configuration options.
   * @param  {filter} [options.filter] A function used to filter the resulting array.
   */
  constructor(path, inner, options={}) {
    options.inner = inner;
    super(path, options);
  }

  /**
   * Configures the CollectionQuery given an object of configuration options.
   * 
   * By default, the default value an CollectionQuery will resolve to is an empty array ([]).
   * 
   * The CollectionQuery supports a filter option. This is expected to be a function that
   * is called for every item in the array and where this function does not return
   * a truthy value, then the corresponding item is omitted.
   * 
   * @param  {object}   options          An object of further configuration options.
   * @param  {Query}    options.inner    The inner query representing what to pick from each context.
   * @param  {function} [options.filter] A function used to filter the resulting array.
   */
  configure(options) {
    super.configure(options);

    this.options.inner = Query.factory(this.options.inner);

    if (!this.options.hasOwnProperty('default'))
      this.options.default = [];

    if (this.options.hasOwnProperty('filter'))
      this.options.format.push((list) => list.filter(this.options.filter));
  }

  /**
   * Locates the array of containers in the given document and attempts to
   * execute the inner query on each container.
   * 
   * @param  {Document}       document  The document to locate the array of containers in.
   * @return {Promise<any>[]} An array of promises resolving to inner querys picked from each container.
   */
  find(document) {
    let children = document.children(this.options.path);

    if (children !== undefined)
      return children.map(child => this.options.inner.on(child));
  }

  /**
   * Given an array of promises, this method simply returns a promise that is
   * fulfilled when all promises in the array have been fulfilled.
   *   
   * @param  {Promise<any>[]} array An array of inner query promises.
   * @param  {Document}       document The document the containers were retrieved from.
   * @return {Promise}        A promise that is fulfilled when all the items in the array are fulfilled.
   */
  build(array, document) {
    return Promise.all(array);
  }
}

module.exports = CollectionQuery;

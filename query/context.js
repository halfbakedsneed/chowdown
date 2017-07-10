const Query = require('./');
const { first } = require('lodash');

/**
 * When executed, this query will return a promise resolving to
 * the result of the inner query executed within a context.
 *
 * @class ContextQuery
 * @extends Query
 */
class ContextQuery extends Query {
  /**
   * Constructs a ContextQuery given a path to the outer context and
   * an inner query that will be resolved relative to this context.
   *
   * Also takes an additional object of configuration options.
   * 
   * @param  {string} path      The path to the outer context.
   * @param  {Query}  inner     The inner query to execute relative to the outer context.
   * @param  {object} [options] An object of additional configuration options.
   */
  constructor(path, inner, options={}) {
    options.inner = inner;
    super(path, options);
  }

  /**
   * Configures the ContextQuery given an object of configuration options.
   *
   * If the inner Query of this query is not already a Query object, then one will
   * be constructed.
   * 
   * @param  {object} options       An object of configuration options.
   * @param  {object} options.inner The inner query to execute relative to the outer context.
   */
  configure(options) {
    super.configure(options);
    this.options.inner = Query.factory(this.options.inner);
  }

  /**
   * Finds the context in the given document and resolves the inner query relative to this context.
   * 
   * @param  {Document}     document The document to retrieve the context from.
   * @return {Promise<any>} A promise containing the resolved value of the inner query.
   */
  find(document) {
    let scope = first(document.children(this.options.path));

    if (scope !== undefined)
      return this.options.inner.on(scope);
  }
}

module.exports = ContextQuery;

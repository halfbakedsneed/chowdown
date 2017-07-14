const Query = require('./');
const { first } = require('lodash');

/**
 * When executed, this query will return a promise resolving to
 * the result of the inner query executed within the context of a child document.
 *
 * @class ContextQuery
 * @extends Query
 */
class ContextQuery extends Query {
  /**
   * Constructs a ContextQuery given a selector for the outer context document and
   * an inner query that will be resolved relative to this documentt.
   *
   * Also takes an additional object of configuration options.
   * 
   * @param  {string} selector  The selector for the outer context.
   * @param  {Query}  inner     The inner query to execute relative to the outer context.
   * @param  {object} [options] An object of additional configuration options.
   */
  constructor(selector, inner, options={}) {
    options.inner = inner;
    super(selector, options);
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
   * Finds the context child document in the given document and resolves the inner query
   * relative to this child document.
   * 
   * @param  {Document}     document The document to retrieve the child document from.
   * @return {Promise<any>} A promise containing the resolved value of the inner query.
   */
  find(document) {
    let context = first(document.children(this.options.selector));

    if (context !== undefined)
      return this.options.inner.on(context);
  }
}

module.exports = ContextQuery;

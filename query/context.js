const Query = require('./');
const { first } = require('lodash');

/**
 * A class representing an query that encapsulates another query.
 * It resolves to the result of the inner query relative to this query's path.
 */
class ContextQuery extends Query {

  /**
   * Constructs a ContextQuery given a path to the outer context and
   * an inner query that will be resolved relative to this context.
   *
   * Also takes an additional object of configuration options.
   * 
   * @param  {string}  path     The path to the outer context.
   * @param  {Query}              contents The inner query to resolve relative to the context.
   * @param  {object}             options  An object of additional configuration options.
   */
  constructor(path, contents, options={}) {
    options.contents = contents;
    super(path, options);
  }

  /**
   * Configures the ContextQuery given an object of configuration options.
   *
   * If the inner Query of this query is not already a Query object, then one will
   * be constructed.
   * 
   * @param  {object}     options An object of configuration options.
   * @return {undefined}
   */
  configure(options) {
    super.configure(options);
    this.options.contents = Query.factory(this.options.contents);
  }

  /**
   * Finds the context and resolves the inner query relative to this context in the given document.
   * 
   * @param  {Document}   document The document to retrieve the context from.
   * @return {Promise<*>} A promise containing the resolved value of the inner query.
   */
  find(document) {
    let scope = first(document.children(this.options.path));

    if (scope !== undefined)
      return this.options.contents.on(scope);
  }
}

module.exports = ContextQuery;
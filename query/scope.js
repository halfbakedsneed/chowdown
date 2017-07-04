const Query = require('./');
const { first } = require('lodash');

/**
 * A class representing an query that encapsulates another query.
 * It resolves to the inner query relative to this query's path (hence scoped).
 */
class ScopeQuery extends Query {

  /**
   * Constructs a ScopeQuery given a path to the outer scope and
   * the inner query that will be resolved relative to this scope.
   *
   * Also takes an additional object of configuration options.
   * 
   * @param  {(string|function)}  path     The path to the outer scope.
   * @param  {Query}            contents The inner query to resolve relative to the scope.
   * @param  {object}             options  An object of additional configuration options.
   */
  constructor(path, contents, options={}) {
    options.contents = contents;
    super(path, options);
  }

  /**
   * Configures the ScopeQuery given an object of configuration options.
   *
   * If the inner contents of the scope is not already an Query, then one will
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
   * Finds the scope and its contents relative to the scope in the given document.
   * 
   * @param  {Document}   document The document to retrieve the scope and it's contents from.
   * @return {Promise<*>} A promise containing the resolved value of the scope's inner contents.
   */
  find(document) {
    let scope = first(document.children(this.options.path));

    if (scope !== undefined)
      return this.options.contents.from(scope);
  }
}

module.exports = ScopeQuery;
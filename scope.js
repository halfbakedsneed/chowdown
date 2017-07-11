const { extendWith } = require('lodash');

/**
 * A class that wraps a document and allows for easy creation
 * and execution of different types of queries.
 *
 * @class Scope
 */
class Scope {
  /**
   * Constructs a Scope given a document to act as the context
   * for all queries.
   * 
   * @param  {Document} Document  The document to wrap.
   */
  constructor(document) {
    this.options = {};
    this.options.document = document;
  }

  /**
   * Returns the Document used by this scope.
   * 
   * @return {Document} The Document used in this scope.
   */
  document() {
    return this.options.document;
  }

  /**
   * Executes a given Query within the context of this scope.
   * 
   * @param  {Query}        query The query to execute.
   * @return {Promise<any>} The result of the query.
   */
  execute(query) {
    return query.on(this.options.document);
  }
}

module.exports = Scope;

/**
 * A factory function that creates a Scope given a Document.
 * If a Scope is passed instead of a document, then that will
 * be returned instead.
 * 
 * @param  {Document|Scope} document The document to wrap.
 * @return {Scope}          The created Scope.
 */
Scope.factory = function(document) {
  if (document instanceof Scope)
    return document;

  return new Scope(document);
}

// Late load the query class to avoid circular dependency issues.
const Query = require('./query');

/**
 * Create a method on the Scope class for each type of query that when called
 * will create and execute that query.
 */
extendWith(Scope.prototype, Query.factory, (_, fn) => function(...args) {
  return this.execute(fn(...args));
});

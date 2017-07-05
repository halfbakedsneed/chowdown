const { extendWith } = require('lodash');

/**
 * A class that wraps a document and allows for easy creation
 * and execution of different query types.
 */
class Scope {

  /**
   * Constructs a Scope given a document to act as the root.
   * 
   * @param  {Document} Document  The document to wrap.
   */
  constructor(document) {
    this.options = {};
    this.options.document = document;
  }

  /**
   * Returns the inner Document used by this scope.
   * 
   * @return {Document} The Document used by this scope.
   */
  document() {
    return this.options.document;
  }

  /**
   * Executes a given query within the context of this scope.
   * 
   * @param  {Query}  query  The query to execute.
   * @return {*} The result of the query.
   */
  execute(query) {
    return query.on(this.options.document);
  }
}

module.exports = Scope;

/**
 * A factory function that creates a Scope given a Document.
 * If a Scope is passed instead of a document, it will simply
 * be returned.
 * 
 * @param  {Document|Scope} document The document to wrap.
 * @return {Scope}  The created Scope.
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
 * will create and execute that query with the given parameters.
 */
extendWith(Scope.prototype, Query.factory, (_, fn) => function(...args) {
  return this.execute(fn(...args));
});

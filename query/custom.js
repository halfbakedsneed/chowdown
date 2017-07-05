const Query = require('./');
const Scope = require('../scope');
const { first } = require('lodash');

/**
 * A class representing a query that resolves with the
 * result of its inner function called with a Scope.
 */
class CustomQuery extends Query {

  /**
   * Constructs a CustomQuery given an inner function.
   *
   * Also takes an additional object of configuration options.
   * 
   * @param  {function} fn        The inner function.
   * @param  {object}   options   An object of additional configuration options.
   */
  constructor(fn, options={}) {
    options.fn = fn;
    super(undefined, options);
  }

  /**
   * Finds the value of the inner function given the document.
   * Will create a Scope using this document and pass it to the inner function.
   * 
   * @param  {Document}   document The document to create a scope from.
   * @return {Promise<*>} A promise containing the result of the inner function.
   */
  find(document) {
    return this.options.fn(Scope.factory(document));
  }
}

module.exports = CustomQuery;
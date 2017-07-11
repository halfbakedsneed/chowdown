const Query = require('./');
const Scope = require('../scope');
const { first } = require('lodash');

/**
 * When executed, this query will return a promise resolving to the
 * result of it's inner function being passed a Scope of a given document.
 *
 * @class CallbackQuery
 * @extends Query
 */
class CallbackQuery extends Query {
  /**
   * Constructs a CallbackQuery given an inner function and an additional
   * object of configuration options.
   *
   * @param  {function} fn        The inner function.
   * @param  {object}   [options] An object of additional configuration options.
   */
  constructor(fn, options={}) {
    options.fn = fn;
    super(undefined, options);
  }

  /**
   * Finds the value of the inner function given the document.
   * Will create a Scope using this document and pass it to the inner function.
   * 
   * @param  {Document}     document The document to create a scope from.
   * @return {Promise<any>} A promise containing the result of the inner function.
   */
  find(document) {
    return this.options.fn(Scope.factory(document));
  }
}

module.exports = CallbackQuery;
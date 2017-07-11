const Query = require('./');

/**
 * When executed, this query will return a promise resolving to
 * a string found inside a document.
 *
 * If the value found within the document is not a string, it will be
 * coerced into one.
 *
 * @class StringQuery
 * @extends Query
 */
class StringQuery extends Query {
  /**
   * Constructs a StringQuery given a path to the string in a document
   * and an object of additional configuration options.
   * 
   * @param  {string} path                 The path to the string in a document.
   * @param  {object} [options]            An object of additional configuration options.
   * @param  {object} [options.default=''] The default value this query will resolve to.
   */
  constructor(path, options) {
    super(path, options);
  }

  /**
   * Configures the StringQuery given an object of configuration options.
   * By default, the default value a StringQuery will resolve to is an empty string ('').
   * 
   * @param  {object} options              An object of additional configuration options.
   * @param  {object} [options.default=''] The default value this query will resolve to.
   */
  configure(options) {
    super.configure(options);

    if (!this.options.hasOwnProperty('default'))
      this.options.default = '';
  }

  /**
   * Given the retrieved value, this method simply coerces it into a String.
   * 
   * @param  {any}      value    The query's value retrieved from the document.
   * @param  {Document} document The document the value was retrieved from.
   * @return {string}            The resulting, casted string.
   */
  build(value, document) {
    return String(value);
  }
}

module.exports = StringQuery;
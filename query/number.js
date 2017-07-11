const Query = require('./');

/**
 * When executed, this query will return a promise resolving to
 * a number found inside a document.
 *
 * If the value found within the document is not a number, it will be
 * coerced into one.
 *
 * @class NumberQuery
 * @extends Query
 */
class NumberQuery extends Query {
  /**
   * Constructs a NumberQuery given a path to the number in a document and
   * an object of additional configuration options.
   * 
   * @param  {string} path                  The path to the number in a document.
   * @param  {object} [options]             An object of additional configuration options.
   * @param  {number} [options.default=NaN] The default value this query will resolve to.
   */
  constructor(path, options) {
    super(path, options);
  }

  /**
   * Configures the NumberQuery given an object of configuration options.
   *
   * By default, the default value a NumberQuery will resolve to is NaN (Number.NaN).
   * 
   * @param  {object} options               The object of configuration options
   * @param  {number} [options.default=NaN] The default value this query will resolve to.
   */
  configure(options) {
    super.configure(options);

    if (!this.options.hasOwnProperty('default'))
      this.options.default = Number.NaN;
  }

  /**
   * Given the retrieved value, this method simply casts it to a Number.
   * 
   * @param  {any}      value    The query's retreived value.
   * @param  {Document} document The document the value was retrieved from.
   * @return {number}   The value coerced to a number.
   */
  build(value, document) {
    return Number(value);
  }
}

module.exports = NumberQuery;
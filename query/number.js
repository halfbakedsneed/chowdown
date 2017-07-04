const Query = require('./');

/**
 * A class respresenting an query that resolves to a number.
 */
class NumberQuery extends Query {
  /**
   * Constructs a NumberQuery given a document path to the number and
   * an object of additional configuration options.
   * 
   * @param  {(string|function)}  path    The path to the number in a document.
   * @param  {object}             options An object of additional configuration options.
   */
  constructor(path, options) {
    super(path, options);
  }

  /**
   * Configures the NumberQuery given an object of configuration options.
   *
   * By default, the default value a NumberQuery will resolve to is NaN (Number.NaN).
   * 
   * @param  {object}     options The object of configuration options.
   * @return {undefined}         
   */
  configure(options) {
    super.configure(options);

    if (!this.options.hasOwnProperty('default'))
      this.options.default = Number.NaN;
  }

  /**
   * Given the query's retrieved value, this method simply casts it to a Number.
   * 
   * @param  {*}        number   The query's retreived value.
   * @param  {Document} document The document the value was retrieved from.
   * @return {number} The resulting, casted number.
   */
  build(number, document) {
    return Number(number);
  }
}

module.exports = NumberQuery;
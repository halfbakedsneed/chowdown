const Query = require('./');

/**
 * When executed, this query will return a promise resolving to
 * the result of a custom document (i.e cheerio document) function.
 *
 * @class RawQuery
 * @extends Query
 */
class RawQuery extends Query {
  /**
   * Constructs a RawQuery given a raw document function and an additional
   * object of configuration options.
   * 
   * @param  {function} selector  The selector function.
   * @param  {object}   [options] An object of additional configuration options.
   */
  constructor(selector, options={}) {
    super(selector, options);
  }

  /**
   * Passes the raw document function to the given document where it will be executed
   * and have its result returned.
   * 
   * @param  {Document}     document The document to execute the document function within.
   * @return {Promise<any>} A promise containing the result of raw selector function.
   */
  find(document) {
    return document.raw(this.options.selector);
  }
}

module.exports = RawQuery;
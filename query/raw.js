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
   * @param  {function} path      The path function.
   * @param  {object}   [options] An object of additional configuration options.
   */
  constructor(path, options={}) {
    super(path, options);
  }

  /**
   * Passes the raw document function to the given document where it will be executed
   * and have its result returned.
   * 
   * @param  {Document}     document The document to execute the document function within.
   * @return {Promise<any>} A promise containing the result of raw path function.
   */
  find(document) {
    return document.raw(this.options.path);
  }
}

module.exports = RawQuery;
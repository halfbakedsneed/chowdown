const Query = require('./');

/**
 * A class representing a query that in which the path
 * is a function that allows you to specify how the query
 * should be resolved from the document.
 */
class RawQuery extends Query {

  /**
   * Constructs a RawQuery given a raw path function.
   *
   * Also takes an additional object of configuration options.
   * 
   * @param  {function} path      The path function.
   * @param  {object}   options   An object of additional configuration options.
   */
  constructor(path, options={}) {
    super(path, options);
  }

  /**
   * Passes the raw path function to the given document so that it can be executed
   * and its result captured.s
   * 
   * @param  {Document}   document The document to execute the raw query in.
   * @return {Promise<*>} A promise containing the result of raw path function.
   */
  find(document) {
    return document.raw(this.options.path);
  }
}

module.exports = RawQuery;
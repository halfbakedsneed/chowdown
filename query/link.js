const url = require('url');
const StringQuery = require('./string');

/**
 * When executed, this query will return a promise resolving to
 * a link found inside a given document.
 *
 * @class LinkQuery
 * @extends StringQuery
 */
class LinkQuery extends StringQuery {
  /**
   * Constructs a LinkQuery given a path to the link in a document,
   * a base uri to resolve this link against and an object of
   * additional configuration options.
   * 
   * @param  {string} path      The path to the link in a document.
   * @param  {string} [base=''] The base uri to resolve the found uri against.
   * @param  {object} [options] An object of additional configuration options.
   */
  constructor(path, base='', options={}) {
    options.base = base;
    super(path, options);
  }

  /**
   * Finds the link in the document.
   * 
   * @param  {Document} document  The document to find the link in.
   * @return {string}   The link found in the document.
   */
  find(document) {
    return document.link(this.options.path);
  }

  /**
   * Given the retrieved link, this method resolves the found uri
   * against the query's base uri and returns it.
   * 
   * @param  {string}   string    The link retrieved from the document.
   * @param  {Document} document  The document the link was retrieved from.
   * @return {string}   The resulting, uri coerced to a string.
   */
  build(string, document) {
    return url.resolve(this.options.base, string);
  }
}

module.exports = LinkQuery;
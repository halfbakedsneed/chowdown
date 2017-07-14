const url = require('url');
const StringQuery = require('./string');

/**
 * When executed, this query will return a promise resolving to
 * a URI found inside a given document.
 *
 * @class UriQuery
 * @extends StringQuery
 */
class UriQuery extends StringQuery {
  /**
   * Constructs a UriQuery given a selector for the URI in a document,
   * a base URI to resolve this URI against and an object of
   * additional configuration options.
   * 
   * @param  {string} selector  The selector for the URI in a document.
   * @param  {string} [base=''] The base URI to resolve the found URI against.
   * @param  {object} [options] An object of additional configuration options.
   */
  constructor(selector, base='', options={}) {
    options.base = base;
    super(selector, options);
  }

  /**
   * Finds the URI in the document.
   * 
   * @param  {Document} document  The document to find the URI in.
   * @return {string}   The URI found in the document.
   */
  find(document) {
    return document.uri(this.options.selector);
  }

  /**
   * Given the retrieved URI, this method resolves the found URI
   * against the query's base URI and returns it.
   * 
   * @param  {string}   string    The URI retrieved from the document.
   * @param  {Document} document  The document the URI was retrieved from.
   * @return {string}   The resulting, URI coerced to a string.
   */
  build(string, document) {
    return url.resolve(this.options.base, string);
  }
}

module.exports = UriQuery;
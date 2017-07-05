const { URL } = require('url');
const StringQuery = require('./string');

/**
 * A class respresenting an query that resolves to a link.
 */
class LinkQuery extends StringQuery {
  /**
   * Constructs a LinkQuery given a document path to the link
   * and an object of additional configuration options.
   * 
   * @param  {string}  path    The path to the link in a document.
   * @param  {object}             options An object of additional configuration options.
   */
  constructor(path, base, options={}) {
    options.base = base;
    super(path, options);
  }

  /**
   * Finds the link in the document.
   * 
   * @param  {Document} document  The document to find the link in.
   * @return {*} The link found in the document.
   */
  find(document) {
    return document.link(this.options.path);
  }

  /**
   * Given the query's retrieved value, this method creates a url object
   * from the retrieved link and a fallback base uri. It returns this
   * url coerced to a string.
   * 
   * @param  {*}        string    The link retrieved from the document.
   * @param  {Document} document  The document the link was retrieved from.
   * @return {string} The resulting, uri coerced to a string.
   */
  build(string, document) {
    return (new URL(string, this.options.base)).toString();
  }
}

module.exports = LinkQuery;
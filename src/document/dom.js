const cheerio = require('cheerio');
const { isString, isFunction, castArray } = require('lodash');

/**
 * Methods to handle the manipulation of DOM documents.
 * Uses cheerio under the hood.
 *
 * @class DOMDocument
 * @extends Document
 */
module.exports = {

  /**
   * Loads the document given it's body. If the body provided is a string,
   * it will be transformed into a cheerio document.
   * 
   * @param  {(string|cheerio)} body The document body or cheerio object.
   * @return {cheerio}          The loaded cheerio document. 
   */
  loadDocument: function(body) {
    return cheerio.load(body);
  },

  /**
   * Loads the root of the document and wraps it in a cheerio instance.
   * If no root is specified, it's retrieved from the cheerio document itself.
   * 
   * @param  {cheerio} root The root of the document.
   * @return {cheerio} The root of the document.
   */
  loadRoot: function(root) {
    if (root === undefined)
      root = this.options.document.root();

    return this.options.document(root);
  },

  /**
   * Formats and prepares a selector for querying. The method expects a string
   * in a format inspired by the XPath standard.
   * 
   * @param  {string} selector  A string selector for format.
   * @return {array}  The formatted selector;
   */
  formatSelector: function(selector) {
    if (isString(selector))
      return selector.split('/');

    return [''];
  },

  /**
   * Queries the cheerio document given a selector. If the first part of the
   * formatted selector is an empty string, the root of the document is returned.
   * 
   * @param  {array}   selector The selector for query.
   * @return {cheerio} The result of the query.
   */
  query: function(selector) {
    if (selector[0] === '')
      return this.options.root;      

    return this.options.document(selector[0], this.options.root);
  },

  /**
   * Calls the given document function with the cheerio object as the first
   * parameter and the document's root as the second parameter.
   * 
   * @param  {function} fn The document function to call.
   * @return {any}      The result of the document function. 
   */
  queryRaw: function(fn) {
    return fn(this.options.document, this.options.root);
  },

  /**
   * Queries the cheerio document for children given a selector.
   * If the result of the query is either not a cheerio result set or
   * the set contains no results, then undefined is returned.
   * 
   * @param  {array}   selector The selector for query.
   * @return {cheerio} The children query set.
   */
  queryChildren: function(selector) {
    let result = this.query(selector);

    if (!(result instanceof cheerio) || result.length == 0)
      return undefined;

    return result.toArray();
  },

  /**
   * Queries the document for a URI. Will attempt to grab the href
   * attribute of a dom element if no other attribute was specified in the selector.
   *   
   * @param  {array} selector  The selector for the URI.
   * @return {*}  The retrieved URI.
   */
  queryUri: function(selector) {
    return this.queryValue(selector, 'href');
  },

  /**
   * Queries the document for an element and attempts to get an attribute from it.
   *
   * Accepts a proritised array of attributes to return from the element if no
   * attribute was specified in the second part of the selector.
   * 
   * Each attribute in this array has a higher return priority than the one succeeding it.
   *
   * If no attribute can be resolved from the retrieved element, undefined is returned instead.
   * If no attribute is specified at all, then the inner text of the element is returned.
   * 
   * @param  {array}    selector      The parts of the selector. The second part corresponds to the desired attribute.
   * @param  {string[]} defaultAttrs  The fallback array of attributes to try for.
   * @return {any}      The retrieved value.
   */
  queryValue: function(selector, defaultAttrs=[]) {
    let value = this.query(selector);
    let attrs = castArray(selector[1] || defaultAttrs);

    if (!(value !== undefined && value.cheerio != null))
      return value;

    if (value.length === 0)
      return undefined;    

    if (attrs.length == 0 && value.text() !== '')
      return value.text();
      
    for (let attr of attrs) {
      if (value.attr(attr) !== undefined)
        return value.attr(attr);
    }
  }
}

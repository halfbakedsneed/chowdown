
// lodash imports
const {
  get, isString, isFunction, isArray,
  isPlainObject, castArray, first
} = require('lodash');


/**
 * Methods to handle the manipulation of JSON documents.
 * Uses lodash under the hood.
 *
 * @class JSONDocument
 * @extends Document
 */
module.exports = {
  /**
   * Loads the document body.
   * If a string is provided, it will be parsed as JSON.
   * 
   * @param  {(string|object|array)} data The document data.
   * @return {any}                   The loaded document.
   */
  loadDocument: function(data) {
    return (isString(data)) ? JSON.parse(data) : data;
  },

  /**
   * Loads the root of the document.
   * Returns the document itself if no root is specified.
   * 
   * @param  {(object|array)} root The intended root of the document.
   * @return {(object|array)} The root of the document.
   */
  loadRoot: function(root) {
    return (root !== undefined) ? root : this.options.document;
  },

  /**
   * Queries the document with the path provided using the lodash get function.
   * 
   * @param  {string} path The path to use in the query.
   * @return {any}    The result of the query.
   */
  query: function(path) {
    if (path === undefined || '')
      return this.options.root;

    return get(this.options.root, path);
  },

  /**
   * Calls the given document function with the root of this document as the first
   * parameter and the entire actual document object as the second parameter.
   * 
   * @param  {function} fn The document function to call.
   * @return {any}      The result of the document function. 
   */
  queryRaw: function(fn) {
    return fn(this.options.root, this.options.document);
  },

  /**
   * Queries the document for children with the path provided.
   * If the children are not an arrays or an objects then the
   * method will return undefined.
   * 
   * @param  {string}             path The path to use in the query.
   * @return {(object[]|array[])} The child objects or arrays.
   */
  queryChildren: function(path) {
    let result = castArray(this.query(path));

    if (!isPlainObject(first(result)) && !isArray(first(result)))
      return undefined;

    return result;
  }
};

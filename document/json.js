
// lodash imports
const {
  get, isString, isFunction, isArray,
  isPlainObject, castArray, first
} = require('lodash');


/**
 * Methods to allow for the manipulation of JSON objects.
 * 
 * @type {object}
 */
module.exports = {
  /**
   * Loads the document data.
   * If a string is provided, it will parse it as JSON.
   * 
   * @param  {(string|object)}  data   The document data.
   * @return {*}   The loaded document.
   */
  loadDocument: function(data) {
    return (isString(data)) ? JSON.parse(data) : data;
  },

  /**
   * Loads the root of the document.
   * Returns the document itself if no root is specified.
   * 
   * @param  {object}
   * @return {object}
   */
  loadRoot: function(root) {
    return (root !== undefined) ? root : this.options.document;
  },

  /**
   * Queries the document with the path provided.
   * Uses the lodash get function.
   * If the provided path is a function, that function will be called instead.
   * The arguments this function takes are (root, document).
   * 
   * @param  {string}   path   The path to use in the query.
   * @return {*}   The result of the query.
   */
  query: function(path) {
    if (path === undefined || '')
      return this.options.root;

    return get(this.options.root, path);
  },


  /**
   * Calls the given path function with the root of this document as the first
   * parameter and the entire actual json object as the second parameter.
   * 
   * @param  {function} fn The path function to call.
   * @return {*}  The result of the path function. 
   */
  queryRaw: function(fn) {
    return fn(this.options.root, this.options.document);
  },

  /**
   * Queries the document for children with the path provided.
   * If the result of the query is not an array or an object then the
   * method will return undefined.
   * 
   * @param  {string}   path   The path to use in the query.
   * @return {object[]} The children objects.
   */
  queryChildren: function(path) {
    let result = castArray(this.query(path));

    if (!isPlainObject(first(result)) && !isArray(first(result)))
      return undefined;

    return result;
  }
};
// lodash imports
const _ = require('lodash');
const capitalize = _.capitalize;
const identity = _.identity;
const castArray = _.castArray;

// the document factory
const factory = require('./index').factory;

/**
 * Abstract class representing a document.
 * Can be queried to retrieve values and children.
 *
 * Only child classes should be instantiated.
 */
class Document {

  /**
   * Builds a document instance.
   * 
   * @param  {string} type      The type of the document e.g 'dom' or 'json'. 
   * @param  {*}      document  The raw document object.
   * @param  {*}      [root]    The element of the document.
   */
  constructor(type, document, root) {
    this.options = {};
    this.options.type = type;   
    this.options.document = this.loadDocument(document);
    this.options.root = this.loadRoot(root);
  }

  /**
   * Resolves the path using provided query function. This result
   * is altered by a provided transform function.
   * 
   * If the path provided is undefined, it will simply return the root of
   * the document.
   *
   * If the result of the query function is undefined, then the transform function
   * will not be applied.
   * 
   * @param  {(string|function)}  path      The path to use in the query.
   * @param  {function}           query     The function used to query.  
   * @param  {function}           transform The function used to transform the result. 
   * @return {*}  The transformed result of the query.
   */
  resolve(path, query, transform) {
    path = this.formatPath(path);

    let result = (path === undefined)
      ? this.options.root
      : query(path);

    if (result === undefined)
      return undefined;

    return transform(result, path);
  }

  /**
   * Creates a child document of the same type given a new root.
   * 
   * @param  {*}  root  The root of the new child document.
   * @return {Document} The new child document.
   */
  create(root) {
    return factory[this.options.type](this.options.document, root);
  }

  /**
   * Given a path, it attempts to resolve a list of children documents.
   * 
   * @param  {(string|function)}  path  The path to to the children.
   * @return {Document[]} An array of child documents.
   */
  children(path) {
    let query = (path) => this.queryChildren(path);
    let transform = (element, path) =>
      castArray(this.transformChildren(element, path))
      .map((root) => this.create(root));

    return this.resolve(path, query, transform);
  }

  /**
   * Given a path, this method attempts to find a leaf value in the document.
   * 
   * @param  {(string|function)}  path  The path to the value.
   * @return {*}  The value of the resolved path.
   */
  value(path) {
    let query = (path) => this.queryValue(path);
    let transform = (element, path) => this.transformValue(element, path);

    return this.resolve(path, query, transform);
  }

  /**
   * Given a path, this method attempts to resolve a link to another document.
   * 
   * @param  {(string|function)}  path  The path to the link.
   * @return {*}  The resolved link.
   */
  link(path) {
    let query = (path) => this.queryLink(path);
    let transform = (element, path) => this.transformLink(element, path);

    return this.resolve(path, query, transform);
  }
}

/**
 * Set the child load methods to the identity function by default.
 */
for (let suffix of ['root', 'document']) {
  Document.prototype['load' + capitalize(suffix)] = identity;
}

/**
 * Set the child format methods to the identity function by default.
 */
for (let suffix of ['path']) {
  Document.prototype['format' + capitalize(suffix)] = identity;
}

/**
 * Set the child transform methods to the identity function by default.
 * Set the child query methods to call the general query method by default.
 */
for (let suffix of ['link', 'value', 'children']) {
  Document.prototype['transform' + capitalize(suffix)] = identity;
  Document.prototype['query' + capitalize(suffix)] = function(path) {
    return this.query(path);
  }
}

module.exports = Document;
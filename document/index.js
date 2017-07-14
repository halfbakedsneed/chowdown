const {
  capitalize, identity, castArray, assignIn
} = require('lodash');

/**
 * An abstract class representing a document.
 * Can be queried to retrieve values, links and child documents.
 *
 * @class Document
 * @abstract
 */
class Document {

  /**
   * Builds a document instance given the type of document (i.e dom), the
   * body of the whole doocument and a root allowing queries to be relative.
   * 
   * @param  {string} type     The type of the document e.g 'dom' or 'json'. 
   * @param  {any}    document The raw document object.
   * @param  {any}    [root]   The root of the document.
   */
  constructor(type, document, root) {
    this.options = {};
    this.options.type = type;
    this.options.document = this.loadDocument(document);
    this.options.root = this.loadRoot(root);
  }

  /**
   * Creates a child document of the same type given a new root.
   * 
   * @param  {any}      root The root of the new child document.
   * @return {Document} The new child document.
   */
  create(root) {
    return Document.factory[this.options.type](this.options.document, root);
  }

  /**
   * Given a function, this method attempts to call it
   * with relevant parameters determined by the concrete type
   * and returns the result.
   * 
   * @param  {function} fn The raw document function to call.
   * @return {any}      The result of the raw document function.
   */
  raw(fn) {
    return this.queryRaw(fn);
  }

  /**
   * Given a selector, it attempts to resolve an array of child documents.
   * 
   * @param  {string}     selector The selector for to the children.
   * @return {Document[]} An array of child documents.
   */
  children(selector) {
    let children = this.queryChildren(this.formatSelector(selector));

    if (children === undefined)
      return undefined;

    return children.map((child) => this.create(child));
  }

  /**
   * Given a selector, this method attempts to find a leaf value in the document.
   * 
   * @param  {string}  selector The selector for the value.
   * @return {any}     The value of the resolved selector.
   */
  value(selector) {
    return this.queryValue(this.formatSelector(selector));
  }

  /**
   * Given a selector, this method attempts to resolve a URI to another document.
   * 
   * @param  {string} selector The selector for the URI.
   * @return {any}    The resolved URI.
   */
  uri(selector) {
    return this.queryUri(this.formatSelector(selector));
  }

  /**
   * An abstract method that handles the querying of values within the document.
   * 
   * @param  {string} selector The selector for the value.
   * @return {any} The value rettrieved.
   * @abstract
   */
  query(selector) {
    throw new Error('the query method must be implemented by the subclass');
  }
}

module.exports = Document;

/**
 * Set the child load methods to the identity function by default.
 */
for (let suffix of ['root', 'document']) {
  Document.prototype['load' + capitalize(suffix)] = identity;
}

/**
 * Set the child format methods to the identity function by default.
 */
for (let suffix of ['selector']) {
  Document.prototype['format' + capitalize(suffix)] = identity;
}

/**
 * Set the child query methods to call the general query method by default.
 */
for (let suffix of ['uri', 'value', 'children']) {
  Document.prototype['query' + capitalize(suffix)] = function(selector) {
    return this.query(selector);
  }
}

/**
 * Holds a list of factory methods to create different document types.
 * 
 * @type {object}
 */
Document.factory = {};

/**
 * Creates and adds a a factory method for a new subtype of document.
 * 
 * @param {string} name    The name of the subtype.
 * @param {object} methods The methods the class will have.
 */
function add(name, methods) {

  // Create a container class that extends Document for our methods.
  class ConcreteDocument extends Document {
    constructor(document, root) {
      super(name, document, root);
    }
  }

  // Assign the methods to the new classes prototype.
  assignIn(ConcreteDocument.prototype, methods);

  // Add a factory method for the new type.
  Document.factory[name] = (document, root) => new ConcreteDocument(document, root);
}

// Add the JSON document type.
add('json', require('./json'));

// Add the DOM document type;
add('dom', require('./dom'));
const {
  capitalize, identity, castArray, assignIn
} = require('lodash');

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
   * @param  {*}      root      The element of the document.
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
   * @param  {*}  root  The root of the new child document.
   * @return {Document} The new child document.
   */
  create(root) {
    return Document.factory[this.options.type](this.options.document, root);
  }

  /**
   * Given a path, it attempts to resolve an array of child documents.
   * 
   * @param  {(string|function)}  path  The path to to the children.
   * @return {Document[]} An array of child documents.
   */
  children(path) {
    let children = this.queryChildren(this.formatPath(path));

    if (children === undefined)
      return undefined;

    return children.map((child) => this.create(child));
  }

  /**
   * Given a path, this method attempts to find a leaf value in the document.
   * 
   * @param  {(string|function)}  path  The path to the value.
   * @return {*}  The value of the resolved path.
   */
  value(path) {
    return this.queryValue(this.formatPath(path));
  }

  /**
   * Given a path, this method attempts to resolve a link to another document.
   * 
   * @param  {(string|function)}  path  The path to the link.
   * @return {*}  The resolved link.
   */
  link(path) {
    return this.queryLink(this.formatPath(path));
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
for (let suffix of ['path']) {
  Document.prototype['format' + capitalize(suffix)] = identity;
}

/**
 * Set the child query methods to call the general query method by default.
 */
for (let suffix of ['link', 'value', 'children']) {
  Document.prototype['query' + capitalize(suffix)] = function(path) {
    return this.query(path);
  }
}

/**
 * Holds a list of factory methods to create different document types.
 * 
 * @type {object}
 */
Document.factory = {};

/**
 * Creates and adds a a factory method for a type of document.
 * 
 * @param {string}  name    The name of the subtype.
 * @param {object}  methods The methods the class will have.
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
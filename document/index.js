// lodash imports
const _ = require('lodash');
const assignIn = _.assignIn;

module.exports = {};

/**
 * Holds a list of factory methods to create different types of documents.
 * 
 * @type {object}
 */
let factory = module.exports.factory = {};

/**
 * Creates and adds a new document subtype class to the factory.
 * 
 * @param {string}  name    The name of the subtype.
 * @param {object}  methods The methods the class will have.
 */
let extend = module.exports.extend = function(name, methods) {

  // Get the base document class.
  const Document = require('./base');

  // Create a container class that extends Document for our methods.
  class ConcreteDocument extends Document {
    constructor(document, root) {
      super(name, document, root);
    }
  }

  // Assign the methods to the new classes prototype.
  assignIn(ConcreteDocument.prototype, methods);

  // Add a factory method for the new type.
  factory[name] = (document, root) => new ConcreteDocument(document, root);
}

// Add the JSON document type.
extend('json', require('./json'));

// Add the DOM document type;
extend('dom', require('./dom'));

const Promise = require('bluebird');
const { assignIn, castArray, identity, flow } = require('lodash');

/**
 * Class representing an element descriptor.
 * Given a document it can attempt to resolve itself.
 */
class Element {
  /**
   * Constructs an element given its document path and an object
   * containing additional configuration options.
   * 
   * @param  {(string|function)}  path    A path to the element in a document.
   * @param  {object}             options An object containing additional configuration options.
   */
  constructor(path, options) {
    options = options || {};
    options.path = path;
    this.configure(options);
  }

  /**
   * Configures the element given an object of configuration options.
   * 
   * @param  {options}  options The object of configuration options.
   * @return {undefined}
   */
  configure(options) {
    this.options = assignIn(this.options, options);
    this.options.format = castArray(this.options.format || identity);

    if (this.options.throwOnMissing === undefined)
      this.options.throwOnMissing = false;
  }

  /**
   * Retrieves the element's raw value using it's path in the given document.
   * 
   * @param  {Document} document  The document to find the element in.
   * @return {*}  The raw value of the element.
   */
  find(document) {
    return document.value(this.options.path);
  }

  /**
   * Filters the retrieved value such that if no value was retrieved, the element's
   * default value will be returned instead.
   * 
   * In addition to this, if no value was retrieved and the throwOnMissing
   * options is set to true, an error will be thrown.
   *
   * If a value WAS retrieved from the document, then this method simply returns it.
   * 
   * @param  {*}        value     The element's value retreived from the document.
   * @param  {Document} document  The document the value was retrieved from.
   * @return {*}  The element's default value or the value retrieved from the document.
   */
  default(value, document) {
    if (value !== undefined)
      return value;

    if (this.options.throwOnMissing)
      throw new Error();
    
    return this.options.default;
  }

  /**
   * Builds the retrieved value such that it is ready for formatting.
   * 
   * @param  {*}        value     The element's value retrieved from the document. 
   * @param  {Document} document  The document the value was retrieved from.
   * @return {*}  The prepared value.
   */
  build(value, document) {
    return value;
  }

  /**
   * Formats the retrieved value by feeding it through the element's format functions.
   * 
   * @param  {*}        value     The element's value.
   * @param  {Document} document  The document the value was retrieved from.
   * @return {*}  The formatted value.
   */
  format(value, document) {
    return flow(this.options.format)(value);
  }

  /**
   * Retrieves this element from the given document and builds and formats it, returning a promise that
   * resolves to this value.
   * 
   * @param  {Document} The document to retrieve this element from.
   * @return {*}  A promise that resolves to the value of this element.
   */
  from(document) {
    return Promise.resolve(document)
      .then((document) => Promise
        .resolve(this.find(document))
        .then((value) => this.default(value, document))
        .then((value) => this.build(value, document))
        .then((value) => this.format(value, document))
      );      
  }
}

module.exports = Element;
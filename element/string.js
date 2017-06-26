const Element = require('./base');

/**
 * A class respresenting an element that resolves to a string.
 */
class StringElement extends Element {
  /**
   * Constructs a StringElement given a document path to the string
   * and an object of additional configuration options.
   * 
   * @param  {(string|function)}  path    The path to the string in a document.
   * @param  {object}             options An object of additional configuration options.
   */
	constructor(path, options) {
    super(path, options);
	}

  /**
   * Configures the StringElement given an object of configuration options.
   *
   * By default, the default value a StringElement will resolve to is an empty string ('').
   * 
   * @param  {object}     options An object of configuration options.
   * @return {undefined}
   */
  configure(options) {
    super.configure(options);

    if (!this.options.hasOwnProperty('default'))
      this.options.default = '';
  }

  /**
   * Given a retrieved value, this function simply casts it to a String.
   * 
   * @param  {*}        string    The element's value retrieved from the document.
   * @param  {Document} document  The document the value was retrieved from.
   * @return {string} The resulting, casted string.
   */
  build(string, document) {
    return String(string);
  }
}

module.exports = StringElement;
const Promise = require('bluebird');
const Element = require('./base');

// The element factory.
const factory = require('./index').factory;

/**
 * A class representing an array element.
 */
class ArrayElement extends Element {

  /**
   * Constructs an array element given a path to an array of containers
   * and an element that describes an item to pick from each container in the array.
   * 
   * Also takes an object of additional configuration options.
   * 
   * @param  {(string|function)}  path    The path to the array container.
   * @param  {(Element|*)}        pick    An element representing what to pick from the container.
   * @param  {object}             options An object of further configuration options.
   */
  constructor(path, pick, options={}) {
    options.pick = pick;
    super(path, options);
  }

  /**
   * Configures the ArrayElement given an object of configuration options.
   * 
   * By default, the default value an ArrayElement will resolve to is an empty array ([]).
   * 
   * The ArrayElement supports a filter option. This is expected to be a function that
   * is called for every item in the array and where this function does not return
   * a truthy value, then the corresponding item is omitted 
   * 
   * @param  {options} options  An object of configuration options.
   * @return {undefined}
   */
  configure(options) {
    super.configure(options);

    this.options.pick = factory(this.options.pick);

    if (!this.options.hasOwnProperty('default'))
      this.options.default = [];

    if (this.options.hasOwnProperty('filter'))
      this.options.format.push((list) => list.filter(this.options.filter));
  }

  /**
   * Locates the array of containers in the given document and attempts to
   * 'pick' an inner element from each container.
   * 
   * @param  {Document} document  The document to locate the array of containers in.
   * @return {array} An array of promises resolving to inner elements picked from each container.
   */
  find(document) {
    let children = document.children(this.options.path);

    if (children !== undefined)
      return children.map(child => this.options.pick.from(child));
  }

  /**
   * Given an array of promises, this method simply returns a promise that when resolved
   * will ensure all promises contained in the array have been fulfilled.
   *   
   * @param  {array}    array    An array of resolved element promises.
   * @param  {Document} document The document the array was retrieved from.
   * @return {Promise}  A promise that is fulfilled when all the items in the array are fulfilled.
   */
  build(array, document) {
    return Promise.all(array);
  }
}

module.exports = ArrayElement;
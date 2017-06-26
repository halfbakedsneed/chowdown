const ArrayElement = require('./array');
const ObjectElement = require('./object');

// The element factory.
const factory = require('./index').factory;

/**
 * A class representing an element that resolves to an array of objects.
 */
class CollectionElement extends ArrayElement {
  /**
   * Constructs a CollectionElement given a path to the containers
   * and an object of properties to pick from the containers.
   *
   * Also takes an object of additional configuration options.
   * 
   * @param  {(string|function)}  path    A path to the containers.
   * @param  {object}             pick    An object of properties to pick from the containers.
   * @param  {object}             options An object of further configuration options.
   */
  constructor(path, pick, options) {
    super(path, factory.object(pick), options);
  }
}

module.exports = CollectionElement;
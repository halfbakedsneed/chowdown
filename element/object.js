const Promise = require('bluebird');
const { mapValues, first } = require('lodash');

const Element = require('./base');

/**
 * A class respresenting an element that to an object.
 */
class ObjectElement extends Element {

  /**
   * Constructs an object element given a path to the container and
   * properties to pick from this container.
   *
   * Also takes an object of additional configuration options.
   * 
   * @param  {(string|function)}  path    The path to the object container.
   * @param  {object}             pick    An object of properties to pick from the container.
   * @param  {object}             options An object of additional configuration options.
   */
  constructor(path, pick, options) {
    options = options || {};
    options.pick = pick;
    super(path, options);
  }

  /**
   * Configures the ObjectElement given an object of configuration options.
   *
   * The pick option describes what each property should resolve to.
   *
   * Non-element properties will be wrapped in Element instances.
   * 
   * @param  {object}   options The object of configuration options.
   * @return {undefined}
   */
  configure(options) {
    super.configure(options);

    if (!this.options.hasOwnProperty('default'))
      this.options.default = {};

    this.options.pick =
      mapValues(this.options.pick, (attr) => {
        if (attr instanceof Element)
          return attr;

        return new Element(attr);
      });
  }

  /**
   * Finds the object container in the given document and attempts
   * to pick properties from this container.
   *
   * Will return an object where each property value is a resolved element promise.
   * 
   * @param  {Document} document The document to find the object container in.
   * @return {object} An object where each property value is a resolved element promise.
   */
  find(document) {
    let object = first(document.children(this.options.path));

    if (object !== undefined)
      return mapValues(this.options.pick, (attr) => attr.from(object));
  }

  /**
   * Constructs a promise from the object such that it is fulfilled when
   * each property's value promise is fulfilled.
   * 
   * @param  {object}   object   The object of resolved element promises.
   * @param  {Doucment} document The document this object was retrieved from.
   * @return {object} A promise that is fulfilled when all the properties of the object are fulfilled.
   */
  build(object, document) {
    return Promise.props(object);
  }
}

module.exports = ObjectElement;
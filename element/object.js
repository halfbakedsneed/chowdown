const Promise = require('bluebird');
const { mapValues, first } = require('lodash');

const Element = require('./base');

// The element factory.
const factory = require('./index').factory;

/**
 * A class respresenting an element that resolves to an object.
 */
class ObjectElement extends Element {

  /**
   * Constructs an ObjectElement given an object of properties to pick from the document.
   *
   * Also takes an object of additional configuration options.
   * 
   * @param  {object}             pick    An object of properties to pick from the container.
   * @param  {object}             options An object of additional configuration options.
   */
  constructor(pick, options={}) {
    options.pick = pick;
    super(undefined, options);
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

    this.options.pick = mapValues(this.options.pick, factory);
  }

  /**
   * Finds the properties in the document.
   *
   * Will return an object where each property value is a resolved element promise.
   * 
   * @param  {Document} document The document to find the object container in.
   * @return {object} An object where each property value is a resolved element promise.
   */
  find(document) {
    return mapValues(this.options.pick, (attr) => attr.from(document));
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
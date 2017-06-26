const {
  isString, isFunction, isPlainObject,
  assignIn, mapValues, first
} = require('lodash');

module.exports = {};

/**
 * An object used to determine what type of element to create when passed
 * a path.
 *
 * Each key is the type of element to create given
 * one of the functions in the corresponding value returns true
 * when passed a path.
 * 
 * @type {Object}
 */
let match = {
  element: [isString, isFunction],
  object: [isPlainObject]
};

/**
 * A function that when passed a path, will determine what
 * type of element to create and create it.
 *
 * If an existing Element is passed, then it will be returned.
 * 
 * @param  {*}        path The path or element.
 * @return {Element}  The constructed element.
 */
let factory = module.exports.factory = function(path) {
  for (let type in match) {
    for (let fn of match[type]) {
      if (fn(path))
        return factory[type](path);
    }
  }

  return factory.element(path);
};

/**
 * An object that maps element names to their respective classes.
 * 
 * @type {Object}
 */
let types = {
  element: require('./base'),
  string: require('./string'),
  number: require('./number'),
  object: require('./object'),
  collection: require('./collection'),
  scope: require('./scope')
};

/**
 * Creates a method on the factory function for each type
 * of element.
 *
 * Each method takes an arbitrary number of arguments that are
 * passed through to the respective element constructor.
 *
 * If the first argument is already an Element, then the element
 * is returned and the consructor is not exectuted.
 */
assignIn(factory, mapValues(types, cls => (...arg) => {
  if (first(arg) instanceof types.element)
    return first(arg);

  return new cls(...arg);
}));
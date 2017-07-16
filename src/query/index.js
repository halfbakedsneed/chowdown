const Promise = require('bluebird');
const { 
  assignIn, castArray, identity, flow,
  extendWith, first, isPlainObject, isFunction
} = require('lodash');

/**
 * The ultimate class representing a query.
 * 
 * When executed, this query will find attempt to find a value inside a given
 * document and return a promise resolving to it.
 *
 * @class Query
 */
class Query {
  /**
   * Constructs an query given a document selector and an object
   * containing additional configuration options.
   * 
   * @param  {string}     selector                       A selector for this query's value in a document.
   * @param  {object}     [options]                      An object containing additional configuration options.
   * @param  {any}        [options.default]              The default valuye to return if no value is found.
   * @param  {boolean}    [options.throwOnMissing=false] Whether or not to throw an error if no value is found.
   * @param  {function[]} [options.format=[]]            The functions used to format the value.
   */
  constructor(selector, options={}) {
    options.selector = selector;
    this.configure(options);
  }

  /**
   * Configures this query given an object of configuration options.
   *
   * By default, throwOnMissing will be set to false and no format functions will
   * be set.
   * 
   * @param  {options}    options                        The object of configuration options.
   * @param  {string}     options.selector               A selector for this query's value in a document.
   * @param  {any}        [options.default]              The default valuye to return if no value is found.
   * @param  {boolean}    [options.throwOnMissing=false] Whether or not to throw an error if no value is found.
   * @param  {function[]} [options.format=[]]            The functions used to format the value.
   */
  configure(options) {
    this.options = assignIn(this.options, options);
    this.options.format = castArray(this.options.format || []);

    if (this.options.throwOnMissing === undefined)
      this.options.throwOnMissing = false;
  }

  /**
   * Retrieves a raw value from the document using the query's selector.
   * 
   * @param  {Document} document  The document to retrieve the value from.
   * @return {any}      The retrieved value.
   */
  find(document) {
    return document.value(this.options.selector);
  }

  /**
   * Determines if the query's default value should be used instead
   * of the value that was retrieved from the document.
   * 
   * If no value was retrieved and the throwOnMissing
   * options is set to true, an error will be thrown.
   * 
   * @param  {any}      value     The value retreived from the document.
   * @param  {Document} document  The document the value was retrieved from.
   * @return {any}      The query's default value or the value retrieved from the document.
   */
  default(value, document) {
    if (value !== undefined)
      return value;

    if (this.options.throwOnMissing)
      throw new Error();
    
    return this.options.default;
  }

  /**
   * "Builds" the retrieved value such that it is ready for formatting.
   * 
   * @param  {any}      value     The query's value retrieved from the document. 
   * @param  {Document} document  The document the value was retrieved from.
   * @return {any}      The built value.
   */
  build(value, document) {
    return value;
  }

  /**
   * Formats the built value by feeding it through the query's format functions.
   * 
   * @param  {any}      value     The query's value.
   * @param  {Document} document  The document the value was retrieved from.
   * @return {any}      The formatted value.
   */
  format(value, document) {
    return flow(this.options.format)(value);
  }

  /**
   * Executes this query on the given document.
   * 
   * @param  {Document} The document to execute this query on.
   * @return {any}      A promise that resolves to the value of this query.
   */
  on(document) {
    return Promise.resolve(document)
      .then((document) => this.find(document))
      .then((value) => this.default(value, document))
      .then((value) => this.build(value, document))
      .then((value) => this.format(value, document));      
  }
}

module.exports = Query;
 
/**
 * An object that maps query subclass names to their respective classes.
 * 
 * @type {object}
 */
let children = {
  raw: require('./raw'),
  string: require('./string'),
  number: require('./number'),
  object: require('./object'),
  collection: require('./collection'),
  context: require('./context'),
  callback: require('./callback'),
  follow: require('./follow'),
  uri: require('./uri'),
  regex: require('./regex')
};

/**
 * A function that when passed a "selector", will determine what
 * type of query to create and create it.
 *
 * If an existing Query is passed, then it will be returned.
 *
 * Accepts a default factory function (create) that will be called
 * if no matching type is found.
 * 
 * @param  {any}      selector    The selector for create a query for.
 * @param  {function} create  A default factory function.
 * @return {Query}    The constructed query.
 */
Query.factory = function(selector, create=Query.factory.string) {
  if (isPlainObject(selector)) 
    create = Query.factory.object; 

  if (isFunction(selector))
    create = Query.factory.callback;

  return create(selector);
}

/**
 * Creates a method on the factory function for each query subclass.
 *
 * Each method takes an arbitrary number of arguments that are
 * passed through to the respective query constructor.
 *
 * If the first argument is already an Query, then it's
 * is returned and the consructor is not exectuted.
 */
extendWith(Query.factory, children, (_, type) => function(...args) {
  if (first(args) instanceof Query)
    return first(args);

  return new type(...args);
});

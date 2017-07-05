const Promise = require('bluebird');
const { assignIn, castArray, identity, flow, extendWith, first, isPlainObject, isFunction } = require('lodash');

/**
 * Class representing an query descriptor.
 * Given a document it can attempt to resolve itself.
 */
class Query {
  /**
   * Constructs an query given its document path and an object
   * containing additional configuration options.
   * 
   * @param  {(string|function)}  path    A path to the query in a document.
   * @param  {object}             options An object containing additional configuration options.
   */
  constructor(path, options={}) {
    options.path = path;
    this.configure(options);
  }

  /**
   * Configures the query given an object of configuration options.
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
   * Retrieves the query's raw value using it's path in the given document.
   * 
   * @param  {Document} document  The document to find the query in.
   * @return {*}  The raw value of the query.
   */
  find(document) {
    return document.value(this.options.path);
  }

  /**
   * Filters the retrieved value such that if no value was retrieved, the query's
   * default value will be returned instead.
   * 
   * In addition to this, if no value was retrieved and the throwOnMissing
   * options is set to true, an error will be thrown.
   *
   * If a value WAS retrieved from the document, then this method simply returns it.
   * 
   * @param  {*}        value     The query's value retreived from the document.
   * @param  {Document} document  The document the value was retrieved from.
   * @return {*}  The query's default value or the value retrieved from the document.
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
   * @param  {*}        value     The query's value retrieved from the document. 
   * @param  {Document} document  The document the value was retrieved from.
   * @return {*}  The prepared value.
   */
  build(value, document) {
    return value;
  }

  /**
   * Formats the retrieved value by feeding it through the query's format functions.
   * 
   * @param  {*}        value     The query's value.
   * @param  {Document} document  The document the value was retrieved from.
   * @return {*}  The formatted value.
   */
  format(value, document) {
    return flow(this.options.format)(value);
  }

  /**
   * Executes this query on the given document.
   * 
   * @param  {Document} The document to execute the query on.
   * @return {*}  A promise that resolves to the value of this query.
   */
  on(document) {
    return Promise.resolve(document)
      .then((document) => Promise
        .resolve(this.find(document))
        .then((value) => this.default(value, document))
        .then((value) => this.build(value, document))
        .then((value) => this.format(value, document))
      );      
  }
}

module.exports = Query;
 
/**
 * An object that maps query subclass names to their respective classes.
 * 
 * @type {Object}
 */
let children = {
  base: Query,
  raw: require('./raw'),
  string: require('./string'),
  number: require('./number'),
  object: require('./object'),
  collection: require('./collection'),
  context: require('./context'),
  callback: require('./callback'),
  follow: require('./follow'),
  link: require('./link')
};

/**
 * A function that when passed a path, will determine what
 * type of query to create from that path and create it.
 *
 * If an existing Query is passed, then it will be returned.
 *
 * Accepts a default factory function (create) that will be called
 * if no matching type is found.
 * 
 * @param  {*}        path    The path to create a query for.
 * @param  {function} create  A default factory function.
 * @return {Query}  The constructed query.
 */
Query.factory = function(path, create=Query.factory.base) {
  if (path instanceof Query)
    return path;

  if (isPlainObject(path)) 
    return new children.object(path);

  if (isFunction(path))
    return new children.callback(path);

  return create(path);
}


/**
 * Creates a method on the factory function for each type
 * of query.
 *
 * Each method takes an arbitrary number of arguments that are
 * passed through to the respective query constructor.
 *
 * If the first argument is already an Query, then the query
 * is returned and the consructor is not exectuted.
 */
extendWith(Query.factory, children, (_, type) => function(...args) {
  if (first(args) instanceof Query)
    return first(args);

  return new type(...args);
});

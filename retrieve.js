const Promise = require('bluebird');
const rp = ((request) => require('request-promise')(request).promise());
const readFile = Promise.promisify(require('fs').readFile);

const Document = require('./document');

// The exported container object.
let retrieve = module.exports = {}

/**
 * Given a request object (or uri) and an object of options, this function
 * returns a document created from the request's response.
 *
 * @param  {(object|string)}  request  The request object.
 * @param  {object}           object   An object of options.
 * @return {Scope}  A Scope object that wraps the document created from response of the request.
 */
retrieve.request = wrap((request, options) =>
  options.client(request).then(body => retrieve.body(body, options))
);

/**
 * Given a filename and an object of options,
 * this function returns a document created from the contents of the file.
 *
 * @param  {string} request  The path to the file.
 * @param  {object} object   An object of options.
 * @return {Scope}  A Scope object that wraps the document created from the contents of the file.
 */
retrieve.file = wrap((file, options) =>
  readFile(file).then(body => retrieve.body(body, options))
);

/**
 * Given a document body and an object of options,
 * this function returns a document created from the body.
 *
 * @param  {*}      request  The document's body.
 * @param  {object} object   An object of options.
 * @return {Scope}  A Scope object that wraps the document created from the body.
 */
retrieve.body = wrap((body, options) =>
  Document.factory[options.type](body)
);

/**
 * Configures the given options object by setting property defaults.
 * 
 * @param  {object} options The options object to configure.
 * @return {object} The configured options object.
 */
function configure(options) {
  options.type = options.type || 'dom';
  options.client = options.client || rp;

  return options;
}

/**
 * Wraps the given function such that its
 * called with a configured options object.
 *
 * @see configure
 * 
 * @param {object}   obj  The elicit library function to add the endpoint to.
 * @param {string}   name The name of the endpoint.
 * @param {Function} fn   The function to wrap for the endpoint.
 */
function wrap(fn) {
  return (...args) => {
    args[fn.length - 1] = configure(args[fn.length - 1] || {});
    return fn(...args);
  }
}

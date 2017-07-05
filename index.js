const Promise = require('bluebird');
const rp = require('request-promise');
const readFile = Promise.promisify(require('fs').readFile);

const Scope = require('./scope');
const Document = require('./document');

/**
 * The library's main function.
 * Simply an alias for elicit.request.
 * 
 * @see request
 */
let elicit = module.exports = function(request, options) {
  return elicit.request(request, options);
};

/**
 * Given a request object (or uri) and an object of options,
 * this function returns a scope that wraps a promise resolving to a document of the request's response.
 *
 * @param  {(object|string)}  request  The request object.
 * @param  {object}           object   An object of options.
 * @return {Scope}  A Scope object that wraps the document created from response of the request.
 */
add(elicit, 'request', function request(request, options) { 
  return Scope.factory(options.client(request).then(Document.factory[options.type]))
});

/**
 * Given a document body and an object of options,
 * this function returns a scope that wraps a document created from the body.
 *
 * @param  {*}      request  The document's body.
 * @param  {object} object   An object of options.
 * @return {Scope}  A Scope object that wraps the document created from the body.
 */
add(elicit, 'body', function body(body, options) { 
  return Scope.factory(Document.factory[options.type](body))
});

/**
 * Given a filename and an object of options,
 * this function returns a scope that wraps a document created from the contents of the file.
 *
 * @param  {string} request  The path to the file.
 * @param  {object} object   An object of options.
 * @return {Scope}  A Scope object that wraps the document created from the contents of the file.
 */
add(elicit, 'file', function file(file, options) { 
  return Scope.factory(readFile(file).then(Document.factory[options.type]))
});

/**
 * Configures the given options object by setting property defaults.
 * 
 * @param  {object} options The options object to configure.
 * @return {object} The configured options object.
 */
function configure(options) {
  options.type = options.type || 'dom';
  options.client = options.client || ((request) => rp(request).promise());

  return options;
}

/**
 * Adds an endpoint to the library given the library function,
 * the name of the endpoint and the function.
 *
 * Wraps the given function such that the given function
 * is called with a configured options object when the corresponding
 * endpoint is called.
 * 
 * @param {object}   obj  The elicit library function to add the endpoint to.
 * @param {string}   name The name of the endpoint.
 * @param {Function} fn   The function to wrap for the endpoint.
 */
function add(obj, name, fn) {
  obj[name] = (...args) => {
    configure(args[fn.length - 1] = (args[fn.length - 1] || {}));
    return fn(...args);
  }
}

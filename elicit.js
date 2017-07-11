const Scope = require('./scope');
const retrieve = require('./retrieve');

/**
 * The main library function.
 * Simply an alias for elicit.request.
 * 
 * @see elicit.request
 */
let elicit = module.exports = function(request, options) {
  return elicit.request(request, options);
};

/**
 * Resolves the given request and returns a Scope allowing you to easily query
 * the document.
 *
 * @param  {(object|string)} request          The request uri or request object.
 * @param  {object}          [options]        An object of options.
 * @param  {function}        [options.client] The client function to use to resolve the request.
 * @return {Scope}           A Scope object that wraps the document created from response of the request.
 */
elicit.request = function(request, options) { 
  return Scope.factory(retrieve.request(request, options));
};

/**
 * Reads the given file and returns a Scope allowing you to easily query
 * the document.
 *
 * @param  {string} request   The filename.
 * @param  {object} [options] An object of options.
 * @return {Scope}  A Scope object that wraps the document created from the contents of the file.
 */
elicit.file = function(file, options) { 
  return Scope.factory(retrieve.file(file, options));
};

/**
 * Parses the given body (either a DOM stringor cheerio document)
 * and returns a Scope allowing you to easily query the document.
 * 
 * @param  {(string|cheerio)} body      The document's body.
 * @param  {object}           [options] An object of options.
 * @return {Scope}            A Scope object that wraps the document created from the body.
 */
elicit.body = function(body, options) { 
  return Scope.factory(retrieve.body(body, options));
};
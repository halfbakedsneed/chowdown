const { clone } = require('lodash');
const Scope = require('./scope');
const Query = require('./query');
const retrieve = require('./retrieve');

/**
 * The main library function.
 * Simply an alias for chowdown.request.
 * 
 * @see chowdown.request
 */
let chowdown = module.exports = function(request, options) {
  return chowdown.request(request, options);
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
chowdown.request = function(request, options) { 
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
chowdown.file = function(file, options) { 
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
chowdown.body = function(body, options) { 
  return Scope.factory(retrieve.body(body, options));
};

/**
 * Allow for the creation of queries.
 * 
 * @type {object}
 */
chowdown.query = clone(Query.factory);

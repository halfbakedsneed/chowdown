const Scope = require('./scope');
const retrieve = require('./retrieve');

/**
 * The library's main function.
 * Simply an alias for elicit.request.
 * 
 * @see elicit.request
 */
let elicit = module.exports = function(request, options) {
  return elicit.request(request, options);
};

/**
 * Creates a document from the result of the request and wraps it in a Scope.
 *
 * @param  {(object|string)}  request  The request object.
 * @param  {object}           object   An object of options.
 * @return {Scope}  A Scope object that wraps the document created from response of the request.
 */
elicit.request = function(request, options) { 
  return Scope.factory(retrieve.request(request, options));
};

/**
 * Creates a document from the contents of the file and wraps it in a Scope.
 *
 * @param  {string} request  The path to the file.
 * @param  {object} object   An object of options.
 * @return {Scope}  A Scope object that wraps the document created from the contents of the file.
 */
elicit.file = function(file, options) { 
  return Scope.factory(retrieve.file(file, options));
};

/**
 * Creates a document from the body and wraps it in a Scope.
 * 
 * @param  {*}      request  The document's body.
 * @param  {object} object   An object of options.
 * @return {Scope}  A Scope object that wraps the document created from the body.
 */
elicit.body = function(body, options) { 
  return Scope.factory(retrieve.body(body, options));
};

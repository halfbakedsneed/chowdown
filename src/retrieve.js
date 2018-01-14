const Promise = require('bluebird');
const rp = ((request) => require('request-promise')(request).promise());
const readFile = Promise.promisify(require('fs').readFile);

const Document = require('./document');

let retrieve = module.exports = {}

/**
 * Given a request object (or uri) and an object of options, this function
 * returns a promise resolving to a document created from the request's response.
 *
 * @param  {(object|string)}   request             The request object.
 * @param  {object}            [options]           An object of options.
 * @param  {object}            [options.client=rp] A client function used to resolve the request.
 * @return {Promise<Document>} A promise resolving to a document created from response of the request.
 */
retrieve.request = withConfig((request, options) =>
  options.client(request).then(body => retrieve.body(body, options))
);

/**
 * Given a filename and an object of options this function returns a
 * document created from the contents of the file.
 *
 * @param  {string}            file      The path to the file.
 * @param  {object}            [options] An object of options.
 * @return {Promise<Document>} A promise resolving to a document created from the contents of the file.
 */
retrieve.file = withConfig((file, options) =>
  readFile(file).then(body => retrieve.body(body, options))
);

/**
 * Given a document body (either a DOM string or cheerio object)
 * and an object of options, this function returns a document created from the body.
 *
 * @param  {(string|cheerio)}  body      The document's body.
 * @param  {object}            [options] An object of options.
 * @return {Promise<Document>} A promise resolving to a document created from the given body.
 */
retrieve.body = withConfig((body, options) =>
  Promise.resolve(Document.factory[options.type](body))
);

/**
 * Wraps the given function such that its
 * called with a configured options object.
 * 
 * @param  {function} fn The function to wrap.
 * @return {function} The wrapped function.
 */
function withConfig(fn) {
  return (source, options={}) => {
    options.type = 'dom';
    options.client = options.client || rp;

    return fn(source, options);
  }
}

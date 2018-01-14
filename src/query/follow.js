const Query = require('./');
const retrieve = require('../retrieve');
const { identity, set } = require('lodash');

/**
 * When executed, this query will return a promise resolving to
 * the result of the inner query executed within the context of another
 * page.
 *
 * @class FollowQuery
 * @extends Query
 */
class FollowQuery extends Query {

  /**
   * Constructs a FollowQuery given a query to find a URI within a document
   * and an inner query to execute on the document resolved from the URI.
   *
   * Also takes an additional object of configuration options.
   * 
   * @param  {Query}  uri       A query pointing to a URI for a different document.
   * @param  {Query}  inner     The query to execute on the other document.
   * @param  {object} [options] An object of additional configuration options.
   */
  constructor(uri, inner, options={}) {
    options.uri = uri;
    options.inner = inner;
    super(undefined, options);
  }

  /**
   * Configures the FollowQuery given an object of configuration options.
   *
   * If the inner query and URI query are not already Query objects,
   * then Query objects will be created from them.
   * 
   * @param  {object} options       An object of configuration options.
   * @param  {Query}  options.uri   A query pointing to a URI for a different document.
   * @param  {Query}  options.inner The query to execute on the other document.
   */
  configure(options) {
    super.configure(options);
    this.options.uri = Query.factory(this.options.uri, Query.factory.uri);
    this.options.inner = Query.factory(this.options.inner);
    this.options.request = this.options.request || {};
  }

  /**
   * Finds the URI in the given document and retrieves the document
   * from this URI. The inner query will be executed on this retrieved
   * document and its result will be returned.
   * 
   * @param  {Document}     document The document containing the URI linking to the other document.
   * @return {Promise<any>} A promise containing the result of the inner query on the retrieved document.
   */
  find(document) {
    return this.options.uri.on(document)
      .then(uri => this.next(uri))
      .then(document => this.options.inner.on(document))
      .catch(err => undefined);
  }

  /**
   * Retrieves the page at the given URI and returns a
   * document that encapsulates it.
   * 
   * @param  {string}   uri The uri the document is located at.
   * @return {Document} The constructed document.
   */
  next(uri) {
    return retrieve.request(set(this.options.request, 'uri', uri), this.options);
  }
}

module.exports = FollowQuery;

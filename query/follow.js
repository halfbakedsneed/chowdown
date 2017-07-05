const Query = require('./');
const retrieve = require('../retrieve');

const rp = require('request-promise');
const { identity, set } = require('lodash');

/**
 * A class representing a query that resolves to
 * to another query executed on a document from a different page.
 */
class FollowQuery extends Query {

  /**
   * Constructs a FollowQuery given a query to find the uri link
   * and the query to execute on the document at this link.
   *
   * Also takes an additional object of configuration options.
   * 
   * @param  {Query}  uri         A query pointing to a uri for a different document.
   * @param  {Query}  query       The query to execute on the different document.
   * @param  {object} options     An object of additional configuration options.
   */
  constructor(uri, query, options={}) {
    options.uri = uri;
    options.query = query;
    super(undefined, options);
  }

  /**
   * Configures the FollowQuery given an object of configuration options.
   *
   * If the inner query and uri query are not already Query objects,
   * then Query objects will be created.
   * 
   * @param  {object} options An object of configuration options.
   * @return {object} The object of configuration options.
   */
  configure(options) {
    super.configure(options);
    this.options.uri = Query.factory(this.options.uri, Query.factory.link);
    this.options.query = Query.factory(this.options.query);
    this.options.request = this.options.request || {};
  }

  /**
   * Finds the uri in the given document and retrieves the document
   * from this uri. The inner query will be executed on this retrieved
   * document and its result will be returned.
   * 
   * @param  {Document}   document The document containing the uri linking to the other document.
   * @return {Promise<*>} A promise containing the result of the inner query on the retrieved document.
   */
  find(document) {
    return this.options.uri.on(document)
      .then(uri =>
        retrieve.request(set(this.options.request, 'uri', uri), this.options)
      )
      .then(document => this.options.query.on(document))
      .catch(err => undefined);
  }
}

module.exports = FollowQuery;
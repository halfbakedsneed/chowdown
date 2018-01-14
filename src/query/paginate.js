const FollowQuery = require('./follow');
const { flatten, last, isFunction } = require('lodash');

/**
 * When executed, this query will return a promise resolving to
 * the result of the inner query executed on multiple pages 
 * reachable from the original document.
 *
 * @class PaginateQuery
 * @extends Query
 */
class PaginateQuery extends FollowQuery {

  /**
   * Constructs a PaginateQuery given an inner query to execute on each document, 
   * a URI query to find the uri of the next document and a function that
   * determines when to stop paginating.
   *
   * Also takes an additional object of configuration options.
   * 
   * @param  {Query}  inner       A query pointing to a URI for a different document.
   * @param  {Query}  uri         The query to execute on the other document.
   * @param  {object} [options] An object of additional configuration options.
   */
  constructor(inner, uri, max, options={}) {
    options.max = max;
    super(uri, inner, options);
  }

  /**
   * Configures the PaginateQuery given an object of configuration options.
   *
   * If the inner query and URI query are not already Query objects,
   * then Query objects will be created from them.
   *
   * If the given max value is NOT a function but a number,
   * a function will be created that will return false (to stop)
   * after max pages have been perused.
   *
   * If no merge function is provided, the lodash flatten function will
   * be used to merge results.
   * 
   * @param  {object}          options         An object of configuration options.
   * @param  {Query}           options.uri     A query pointing to a URI for a different document.
   * @param  {Query}           options.inner   The query to execute on the other document.
   * @param  {function|number} [options.max]   The function used to determine when to stop.
   * @param  {function}        [options.merge] The function used to merge the results.
   */
  configure(options) {
    super.configure(options);

    this.options.merge = this.options.merge || flatten;

    if (!isFunction(this.options.max))
      this.options.max = (count) => count < (options.max || Infinity);
  }

  /**
   * Executes the inner query on a document and recursively calls itself on the next document
   * located at the uri found in the current document. 
   * 
   * @param  {Document}     document The document containing the URI linking to the other document.
   * @param  {any[]}        [pages]  The results accumulator.
   * @return {Promise<any>} A promise containing the paginated results.
   */
  find(document, pages=[]) {
    return this.options.inner.on(document)
      .then(result => pages.push(result))
      .then(count => this.options.uri.on(document))
      .then(uri => (uri && this.options.max(pages.length, pages))
        ? this.next(uri).then(document => this.find(document, pages))
        : pages
      );
  }

  /**
   * Merges the results using the merge function provided
   * at query creation.
   * 
   * @param  {any[]} pages An array of the page results.
   * @return {any}   The merged page results.
   */
  build(pages) {
    return this.options.merge(pages);
  }
}

module.exports = PaginateQuery;

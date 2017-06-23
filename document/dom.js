const cheerio = require('cheerio');
const { isString, isFunction, castArray } = require('lodash');

/**
 * Methods to handle the manipulation of DOM documents.
 * Uses cheerio under the hood.
 * 
 * @type {object}
 */
module.exports = {

  /**
   * Loads the document. If the argument provided is a string,
   * it will be transformed into a cheerio document.
   * 
   * @param  {(string|cheerio)} data  The document data.
   * @return {cheerio}  The loaded cheerio document. 
   */
	loadDocument: function(data) {
		return cheerio.load(data);
	},

  /**
   * Loads the root of the document and wraps it in a cheerio instance.
   * If no root is specified, it's retrieved from the cheerio document itself.
   * 
   * @param  {object}
   * @return {cheerio}
   */
	loadRoot: function(root) {
    if (root === undefined)
      root = this.options.document.root();

		return this.options.document(root);
	},

  /**
   * Formats and prepares a path for a query.
   * The method expects either a string in a format
   * inspired by the XPath standard or a function.
   * 
   * @param  {(string|function)}  path  A function or string to format.
   * @return {(array|function)}  The formatted path;
   */
	formatPath: function(path) {
		if (isString(path))
			return path.split('/');

    if (isFunction(path))
      return path;

		return [''];
	},

  /**
   * Queries the cheerio document given a path.
   * If the first part of the formatted root is an empty string, the root of the document is returned.
   * If the provided path is a function, it will simply call that function and pass the cheerio
   * document and the intended root of the document.
   * 
   * @param  {(array|function)} path  The path to query.
   * @return {*} The result of the query.
   */
	query: function(path) {
    if (path[0] === '')
      return this.options.root;

		if (isFunction(path))
			return path(this.options.document, this.options.root);

    return this.options.document(path[0], this.options.root);
	},

  /**
   * Queries the cheerio document for children given a path.
   * If the result of the query is either not a cheerio result set or the set contains
   * no results, then undefined is returned.
   * 
   * @param  {(array|function)} path  The path to query.
   * @return {cheerio}  The children query set.
   */
  queryChildren: function(path) {
    let result = this.query(path);

    if (!(result instanceof cheerio) || result.length == 0)
      return undefined;

    return result.toArray();
  },

  /**
   * Queries the document for a link.
   * Will attempt to grab the href attribute of a cheerio dom element if
   * no other attribute was specified in the path.
   *   
   * @param  {(array|function)} path  The path to the link.
   * @return {*}  The retrieved link.
   */
	queryLink: function(path) {
		return this.queryValue(path, ['@href', 'text()']);
	},

  /**
   * Queries the document for an element and attempts to resolve an attribute from it.
   *
   * Accepts a fallback array of attributes to return if one is not specified.
   * Each attribute in the array has a higher return priority than the one succeeding it.
   *
   * If no attribute can be resolved from the result of the query, undefined is returned instead.
   * 
   * @param  {(array|function)} path          The path used in the query.
   * @param  {string[]}         defaultAttrs  The fallback array of attributes to try for.
   * @return {*}  The retrieved value.
   */
	queryValue: function(path, defaultAttrs=['text()']) {
    let value = this.query(path);

    if (!(value instanceof cheerio))
      return value;

    if (value.length === 0)
      return undefined;

		let attrs = castArray(path[1] || defaultAttrs);

		for (let attr of attrs) {
			if (attr.endsWith('()')) {
        let fnName = attr.substr(0, attr.length - 2);
				
        if (isFunction(value[fnName])) {
          let fnValue = value[fnName]();
          
          if (fnValue !== '')
            return fnValue;
        }
			} else if (attr.startsWith('@')) {
        let attrValue = value.attr(attr.substr(1));

				if (attrValue !== undefined)
          return attrValue;
			}
		}
	}
}
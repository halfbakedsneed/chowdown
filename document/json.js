
// lodash imports
const _ = require('lodash');
const get = _.get;
const isString = _.isString;
const isFunction = _.isFunction;


/**
 * Methods to allow for the manipulation of JSON objects.
 * 
 * @type {Object}
 */
module.exports = {
	/**
	 * Loads the document data.
	 * If a string is provided, it will parse it as JSON.
	 * 
	 * @param  {(data|object)} 	data 	The document data.
	 * @return {*} 	The loaded document.
	 */
	loadDocument: function(data) {
		if (isString(data))
			return JSON.parse(data);

		return data;
	},

	/**
	 * Queries the document with the path provided using the get function from lodash.
	 * If the provided path is a function, that function will be called and passed the underlying document.
	 * 
	 * @param  {(string|function)} 	path 	The path to use in the query.
	 * @return {*} 	The result of the query.
	 */
	query: function(path) {
		if (isFunction(path))
			return path(this.options.document);

		return get(this.options.document, path);
	}
};
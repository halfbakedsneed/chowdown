const Query = require('./');

/**
 * When executed, this query will return a promise resolving to
 * a regex match on a string retrieved from a given document.
 *
 * @class RegexQuery
 * @extends Query
 */
class RegexQuery extends Query {
  /**
   * Constructs a RegexQuery given a selector for the string in a document,
   * the regular expression pattern to match on and a regular expression
   * group to choose from the match.
   * 
   * Also takes an object of additional configuration options.
   * 
   * @param  {string} selector                      The selector for the string in a document.
   * @param  {RegExp} pattern                       The regular expression pattern to match on.
   * @param  {number} [group]                       The matched regex group to return.
   * @param  {object} [options]                     An object of additional configuration options.
   * @param  {string|string[]} [options.default=[]] The default value this query will resolve to if no string is found.
   */
  constructor(selector, pattern, group, options={}) {
    options.pattern = pattern;
    options.group = group;
    super(selector, options);
  }

  /**
   * Configures the RegexQuery given an object of configuration options.
   * By default, the the default value for this query will be an empty
   * array (no matches).
   * 
   * @param  {object} options                       An object of configuration options.
   * @param  {number} [options.group]               The matched regex group to return.
   * @param  {string|string[]} [options.default=[]] The default value this query will resolve to if no string is found.
   */
  configure(options) {
    super.configure(options);

    if (!this.options.hasOwnProperty('default'))
      this.options.default = [];
  }

  /**
   * Finds the string in the given document and does a regex match on it using the
   * query's pattern. It will take the group specified in the options.
   * 
   * @param  {Document} document The document to search for the string in.
   * @return {string|string[]}   The matched group(s).
   */
  find(document) {
    let string = super.find(document);

    if (string === undefined)
      return undefined;

    let matches = string.match(this.options.pattern);

    if (!matches)
      return undefined;

    if (this.options.group !== undefined)
      return matches[this.options.group];

    return matches;
  }
}

module.exports = RegexQuery;
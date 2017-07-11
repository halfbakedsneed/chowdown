const Query = require('./');
const StringQuery = require('./string');

/**
 * When executed, this query will return a promise resolving to
 * a regex match on a string retrieved from a given document.
 *
 * @class RegexQuery
 * @extends StringQuery
 */
class RegexQuery extends StringQuery {
  /**
   * Constructs a RegexQuery given a path to the string in a document,
   * the regular expression pattern to match on and a regular expression
   * group to choose from the match.
   * 
   * Also takes an object of additional configuration options.
   * 
   * @param  {string} path      The path to the string in a document.
   * @param  {RegExp} pattern   The regular expression pattern to match on.
   * @param  {number} [group=1] The group number to select.
   * @param  {object} [options] An object of additional configuration options.
   */
  constructor(path, pattern, group, options={}) {
    options.pattern = pattern;
    options.group = group;
    super(path, options);
  }

  /**
   * Configures the RegexQuery given an object of configuration options.
   * By default, the matched regex group to return will be the first one.
   * 
   * @param  {object} options           An object of configuration options.
   * @param  {number} [options.group=1] The regex group number to select.
   */
  configure(options) {
    super.configure(options);

    if (this.options.group === undefined)
      this.options.group = 1;
  }

  /**
   * Finds the string in the given document and does a regex match on it using the
   * query's pattern. It will take the group specified in the options.
   * 
   * @param  {Document} document The document to search for the string in.
   * @return {string} The matched group.
   */
  find(document) {
    let string = super.find(document);

    if (string === undefined)
      return undefined;

    let matches = string.match(this.options.pattern);

    if (!matches || matches[this.options.group] === undefined)
      return undefined;

    return matches[this.options.group];
  }
}

module.exports = RegexQuery;
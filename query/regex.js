const Query = require('./');
const StringQuery = require('./string');

/**
 * A class respresenting a query that resolves to a regex match
 * on a string.
 */
class RegexQuery extends StringQuery {
  /**
   * Constructs a RegexQuery given a document path to the string,
   * the regular expression pattern to match on and a regular expression
   * group to choose from the match.
   * 
   * Also takes an object of additional configuration options.
   * 
   * @param  {string}  path     The path to the string in a document.
   * @param  {RegExp}  pattern  The regular expression pattern to match on.
   * @param  {number}  group    The group number to select.
   * @param  {object}  options  An object of additional configuration options.
   */
  constructor(path, pattern, group, options={}) {
    options.pattern = pattern;
    options.group = group;
    super(path, options);
  }

  /**
   * Configures the RegexQuery given an object of configuration options.
   *
   * By default, the group to take will be the first.
   * 
   * @param  {object}     options An object of configuration options.
   * @return {undefined}
   */
  configure(options) {
    super.configure(options);

    if (this.options.group === undefined)
      this.options.group = 1;
  }

  /**
   * Finds the string and does a regex match on it using the
   * query's pattern. It will take the group specified in the options..
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
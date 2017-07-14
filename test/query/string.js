const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../src/query');
const Document = require('../../src/document');
const sandbox = sinon.sandbox.create();


describe('string query', () => {

  afterEach(() => sandbox.verifyAndRestore());

  it('Returns a string when executed', () => {
    let document = new Document();

    sandbox.stub(document, 'value').returns(3);

    let query = Query.factory.string('selector', {
      default: ''
    });

    return query.on(document)
      .then(result => expect(result).to.equal('3'))
  });

  it('Has an empty string as a default value by default', () => {
    let document = new Document();

    sandbox.stub(document, 'value').returns(undefined);

    let query = Query.factory.string('selector');

    return query.on(document)
      .then(result => expect(result).to.equal(''))
  });

});


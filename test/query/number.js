const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../src/query');
const Document = require('../../src/document');
const sandbox = sinon.sandbox.create();


describe('number query', () => {

  afterEach(() => sandbox.verifyAndRestore());

  it('Returns a number when executed', () => {
    let document = new Document();

   sandbox.stub(document, 'value').returns('3');

    let query = Query.factory.number('selector', {
      default: 0
    });

    return query.on(document)
      .then(result => expect(result).to.equal(3))
  });

  it('Has NaN as a default value by default', () => {
    let document = new Document();

    sandbox.stub(document, 'value').returns(undefined);

    let query = Query.factory.number('selector');

    return query.on(document)
      .then(result => expect(result).to.eql(Number.NaN))
  });

  
});


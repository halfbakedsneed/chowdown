const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../query');
const Document = require('../../document');
const sandbox = sinon.sandbox.create();


describe('number query', () => {

  afterEach(() => sandbox.verifyAndRestore());

  it('Returns a number when executed', () => {
    let document = new Document();

   sandbox.stub(document, 'value').returns('3');

    let query = Query.factory.number('path');

    return query.on(document)
      .then(result => expect(result).to.equal(3))
  });

  
});


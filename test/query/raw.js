const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../src/query');
const Document = require('../../src/document');
const sandbox = sinon.sandbox.create();


describe('raw query', () => {

  afterEach(() => sandbox.verifyAndRestore());

  it('Queries the document with the function', () => {
    let document = new Document();

    sandbox.mock(document).expects('raw').once().withArgs('fn').returns('result');

    let query = Query.factory.raw('fn');

    return query.on(document)
      .then(result => expect(result).to.equal(result));
  });

  
});


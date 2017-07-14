const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../query');
const Document = require('../../document');
const sandbox = sinon.sandbox.create();


describe('uri query', () => {

  afterEach(() => sandbox.verifyAndRestore());

  it('Queries the document correctly', () => {
    let document = new Document();

    sandbox.mock(document).expects('uri').once().withArgs('path').returns('http://uri.com');

    let query = Query.factory.uri('path');

    return query.on(document)
      .then(result => expect(result).to.equal('http://uri.com/'));
  });

  it('Prepends the base URI if specified', () => {
    let document = new Document();

    sandbox.stub(document, 'uri').returns('/uri/query');

    let query = Query.factory.uri('path', 'http://test.com');

    return query.on(document)
      .then(result => expect(result).to.equal('http://test.com/uri/query'));
  });

  it('Throws error if bad URI is retrieved', () => {
    let document = new Document();

    sandbox.stub(document, 'uri').returns('bad_uri');

    let query = Query.factory.uri('path');

    return query.on(document)
      .catch(err => expect(err).to.be.an.instanceof(Error));
  });

  
});


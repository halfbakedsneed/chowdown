const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../query');
const Document = require('../../document');
const sandbox = sinon.sandbox.create();


describe('link query', () => {

  afterEach(() => sandbox.verifyAndRestore());

  it('Queries the document correctly', () => {
    let document = new Document();

    sandbox.mock(document).expects('link').once().withArgs('path').returns('http://link.com');

    let query = Query.factory.link('path');

    return query.on(document)
      .then(result => expect(result).to.equal('http://link.com/'));
  });

  it('Prepends the base uri if specified', () => {
    let document = new Document();

    sandbox.stub(document, 'link').returns('/link/query');

    let query = Query.factory.link('path', 'http://test.com');

    return query.on(document)
      .then(result => expect(result).to.equal('http://test.com/link/query'));
  });

  it('Throws error if bad URL is retrieved', () => {
    let document = new Document();

    sandbox.stub(document, 'link').returns('bad_url');

    let query = Query.factory.link('path');

    return query.on(document)
      .catch(err => expect(err).to.be.an.instanceof(Error));
  });

  
});


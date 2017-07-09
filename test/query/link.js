const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../query');
const Document = require('../../document');


describe('link query', () => {

  let doc;

  beforeEach(() => {
    doc = new Document();
  });

  it('Queries the document correctly', () => {
    let expDoc = sinon.mock(doc).expects('link').once().withArgs('path').returns('http://link.com');

    return Query.factory.link('path')
      .on(doc)
      .then(_ => expDoc.verify());
  });

  it('Prepends the base uri if specified', () => {
    let stub = sinon.stub(doc, 'link').returns('/link/query');

    return Query.factory.link('path', 'http://test.com')
      .on(doc)
      .then(result => expect(result).to.equal('http://test.com/link/query'));
  });

  it('Throws error if bad URL is retrieved', () => {
    let stub = sinon.stub(doc, 'link').returns('bad_url');

    return Query.factory.link('path')
      .on(doc)
      .catch(err => expect(err).to.be.an.instanceof(Error));
  });

  
});


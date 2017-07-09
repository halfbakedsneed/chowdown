const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../query');
const Document = require('../../document');
const originalFactory = Query.factory;


describe('context query', () => {

  let sub, doc;

  beforeEach(() => {
    sub = Query.factory.base('path');
    doc = new Document();
  });
  
  afterEach(() => Query.factory = originalFactory);

  it('Creates a subquery', () => {
    Query.factory = assignIn(sinon.spy(), Query.factory);

    let query = Query.factory.context('path', 'sub');

    assert(Query.factory.withArgs('sub').calledOnce);
  });

  it('Finds context in document', () => {
    Query.factory = assignIn(sinon.stub(), Query.factory);
    Query.factory.returns(sub);

    sinon.stub(sub, 'on');
    let expDoc = sinon.mock(doc).expects('children').once().withArgs('path').returns('context');

    let query = Query.factory.context('path', 'sub');

    return query
      .on(doc)
      .then(_ => expDoc.verify());
  });

  it('Executes subquery within context', () => {
    Query.factory = assignIn(sinon.stub(), Query.factory);
    Query.factory.returns(sub);

    sinon.stub(doc, 'children').returns(['context']);
    let expSub = sinon.mock(sub).expects('on').once().withArgs('context').returns('inner');

    let query = Query.factory.context('path', 'sub');

    return query
      .on(doc)
      .then(_ => expSub.verify())
  });

  it('Returns subquery result', () => {
    Query.factory = assignIn(sinon.stub(), Query.factory);
    Query.factory.returns(sub);

    sinon.stub(doc, 'children').returns(['context']);
    
    let expSub = sinon.mock(sub).expects('on').once().withArgs('context').returns('inner');
    let query = Query.factory.context('path', 'sub');

    return query
      .on(doc)
      .then(result => expect(result).to.equal('inner'));
  });

});


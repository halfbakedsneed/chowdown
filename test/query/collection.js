const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../query');
const Document = require('../../document');
const originalFactory = Query.factory;


describe('collection query', () => {

  let sub, docA, docB;

  beforeEach(() => {
    sub = Query.factory.base('path');
    docA = new Document();
    docB = new Document();
  });
  
  afterEach(() => Query.factory = originalFactory);

  it('Creates a subquery', () => {
    Query.factory = assignIn(sinon.spy(), Query.factory);

    let query = Query.factory.collection('path', 'a');

    assert(Query.factory.withArgs('a').calledOnce);
  });

  it('Correctly queries the document for children', () => {
    Query.factory = assignIn(sinon.stub(), Query.factory);
    Query.factory.returns(sub);

    let docAExp = sinon.mock(docA).expects('children').once().withArgs('path').returns([]);
    let query = Query.factory.collection('path', 'a');

    return query
      .on(docA)
      .then(_ => docAExp.verify());
  });

  it('Executes the subquery correctly', () => {
    Query.factory = assignIn(sinon.stub(), Query.factory);
    Query.factory.returns(sub);

    sinon.stub(docA, 'children').returns([docA, docB]);

    let subExp = sinon.mock(sub).expects('on').twice().withExactArgs(docA).withExactArgs(docB);
    let query = Query.factory.collection('path', 'a');

    return query
      .on(docA)
      .then(_ => subExp.verify());
  });

  it('Constructs an array correctly', () => {
    Query.factory = assignIn(sinon.stub(), Query.factory);
    Query.factory.returns(sub);

    sinon.stub(docA, 'children').returns([docA, docB]);

    let onStub = sinon.stub(sub, 'on');

    onStub.onFirstCall().returns('a');
    onStub.onSecondCall().returns('b');    

    let query = Query.factory.collection('path', 'a');

    return query
      .on(docA)
      .then(result => expect(result).to.eql(['a', 'b']));
  });

  it('Can filter an array correctly', () => {
    Query.factory = assignIn(sinon.stub(), Query.factory);
    Query.factory.returns(sub);

    sinon.stub(docA, 'children').returns([docA, docB]);

    let onStub = sinon.stub(sub, 'on');

    onStub.onFirstCall().returns('a');
    onStub.onSecondCall().returns('b');

    let filter = sinon.mock().twice();

    filter.onFirstCall().returns(false);
    filter.onSecondCall().returns(true);

    let query = Query.factory.collection('path', 'a', {
      filter: filter
    });

    return query
      .on(docA)
      .then(result => expect(result).to.eql(['b']))
      .then(_ => filter.verify());
  });

});


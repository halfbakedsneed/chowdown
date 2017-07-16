const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../src/query');
const Document = require('../../src/document');
const sandbox = sinon.sandbox.create();


describe('collection query', () => {
  
  afterEach(() => sandbox.verifyAndRestore());

  it('Creates a subquery', () => {
    let factory = sandbox.spy(Query, 'factory');
    let query = Query.factory.collection('selector', 'a', {
      default: undefined
    });

    assert(factory.withArgs('a').calledOnce);
  });

  it('Correctly queries the document for children', () => {
    let subQuery = Query.factory();
    let document = new Document();

    sandbox.stub(Query, 'factory').returns(subQuery);
    sandbox.mock(document).expects('children').once().withArgs('selector').returns([]);
    sandbox.stub(subQuery, 'on');

    let query = Query.factory.collection('selector', 'a');

    return query.on(document);
  });

  it('Executes the subquery correctly', () => {
    let subQuery = Query.factory();
    let document = [new Document(), new Document(), new Document()];

    sandbox.stub(Query, 'factory').returns(subQuery);
    sandbox.stub(document[0], 'children').returns([document[1], document[2]]);

    let onStub = sandbox.stub(subQuery, 'on');

    onStub.withArgs(document[1]).returns('b');
    onStub.withArgs(document[2]).returns('c');

    let query = Query.factory.collection('selector');

    return query
      .on(document[0])
      .then(_ => assert(onStub.calledWith(document[1])))
      .then(_ => assert(onStub.calledWith(document[2])));
  });

  it('Constructs an array correctly', () => {
    let subQuery = Query.factory();
    let document = [new Document(), new Document(), new Document()];

    sandbox.stub(Query, 'factory').returns(subQuery);
    sandbox.stub(document[0], 'children').returns([document[1], document[2]]);

    let onStub = sandbox.stub(subQuery, 'on');

    onStub.onCall(0).returns('b');
    onStub.onCall(1).returns('c');

    let query = Query.factory.collection('selector');

    return query
      .on(document[0])
      .then(result => expect(result).to.eql(['b', 'c']));
  });

  it('Can filter an array correctly', () => {
    let subQuery = Query.factory();
    let document = [new Document(), new Document(), new Document()];

    sandbox.stub(Query, 'factory').returns(subQuery);
    sandbox.stub(document[0], 'children').returns([document[1], document[2]]);

    let onStub = sandbox.stub(subQuery, 'on');

    onStub.onCall(0).returns('b');
    onStub.onCall(1).returns('c');

    let filter = sinon.stub();

    filter.withArgs('b').returns(false);
    filter.withArgs('c').returns(true);

    let query = Query.factory.collection('selector', undefined, {
      filter: filter
    });

    return query
      .on(document[0])
      .then(result => expect(result).to.eql(['c']))
      .then(_ => assert(filter.withArgs('b').calledOnce))
      .then(_ => assert(filter.withArgs('c').calledOnce));
  });


  it('Has a default value of an empty array', () => {
    let subQuery = Query.factory();
    let document = [new Document(), new Document(), new Document()];

    sandbox.stub(Query, 'factory').returns(subQuery);
    sandbox.stub(document[0], 'children').returns(undefined);

    let query = Query.factory.collection('selector', undefined);

    return query
      .on(document[0])
      .then(result => expect(result).to.eql([]));
  });

});


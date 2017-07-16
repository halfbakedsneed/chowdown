const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../src/query');
const Document = require('../../src/document');
const sandbox = sinon.sandbox.create();


describe('context query', () => {
  
  afterEach(() => sandbox.verifyAndRestore());

  it('Creates a subquery', () => {
    let factory = sandbox.spy(Query, 'factory');
    let query = Query.factory.context('selector', 'sub');

    assert(factory.withArgs('sub').calledOnce);
  });

  it('Finds context in document', () => {
    let subQuery = Query.factory();
    let document = new Document();

    sandbox.stub(Query, 'factory').returns(subQuery);
    sandbox.stub(subQuery, 'on');

    sandbox.mock(document).expects('children').once().withArgs('selector').returns(['context']);

    let query = Query.factory.context('selector', 'sub');

    return query.on(document);
  });

  it('Executes subquery within context', () => {
    let subQuery = Query.factory();
    let document = new Document();

    sandbox.stub(Query, 'factory').returns(subQuery);
    sandbox.stub(document, 'children').returns(['context']);

    sandbox.mock(subQuery).expects('on').once().withArgs('context').returns('inner');

    let query = Query.factory.context('selector', 'sub');

    return query.on(document);
  });

  it('Returns subquery result', () => {
    let subQuery = Query.factory();
    let document = new Document();

    sandbox.stub(Query, 'factory').returns(subQuery);
    sandbox.stub(document, 'children').returns(['context']);

    sandbox.mock(subQuery).expects('on').once().withArgs('context').returns('inner');

    let query = Query.factory.context('selector', 'sub');

    return query
      .on(document)
      .then(result => expect(result).to.equal('inner'));
  });

  it('Returns default if no context found', () => {
    let subQuery = Query.factory();
    let document = new Document();

    sandbox.stub(Query, 'factory').returns(subQuery);
    sandbox.stub(document, 'children').withArgs('selector').returns(undefined);

    let query = Query.factory.context('selector', 'sub', {
      default: 'default'
    });

    return query.on(document)   
      .then(result => expect(result).to.equal('default'));
  });


});


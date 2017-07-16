const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../src/query');
const sandbox = sinon.sandbox.create();


describe('object query', () => {
  
  afterEach(() => sandbox.verifyAndRestore());

  it('Creates subqueries', () => {
    let factory = sandbox.spy(Query, 'factory');

    let query = Query.factory.object({
      a: 'a',
      b: 'b'
    });

    assert(factory.withArgs('a').calledOnce);
    assert(factory.withArgs('b').calledOnce);
  });

  it('Executes subqueries correctly', () => {
    let subQueryOne = Query.factory();
    let subQueryTwo = Query.factory();

    let factory = sandbox.stub(Query, 'factory');

    factory.withArgs('a').returns(subQueryOne);
    factory.withArgs('b').returns(subQueryTwo);

    sandbox.mock(subQueryOne).expects('on').once().withArgs('document');
    sandbox.mock(subQueryTwo).expects('on').once().withArgs('document');

    let query = Query.factory.object({
      a: 'a',
      b: 'b'
    });

    return query.on('document');
  });

  it('Constructs an object correctly', () => {
    let subQueryOne = Query.factory();
    let subQueryTwo = Query.factory();

    let factory = sandbox.stub(Query, 'factory');

    factory.withArgs('a').returns(subQueryOne);
    factory.withArgs('b').returns(subQueryTwo);

    sandbox.stub(subQueryOne, 'on').returns('a_res');
    sandbox.stub(subQueryTwo, 'on').returns('b_res');

    let query = Query.factory.object({
      a: 'a',
      b: 'b'
    });

    return query.on('document')
      .then(result => expect(result).to.eql({
        a: 'a_res',
        b: 'b_res'
      }));
  });

});


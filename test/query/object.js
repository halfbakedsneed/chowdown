const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../query');
const originalFactory = Query.factory;


describe('object query', () => {

  let subOne, subTwo;

  beforeEach(() => {
    subOne = Query.factory.base('path');
    subTwo = Query.factory.base('path');
  });
  
  afterEach(() => Query.factory = originalFactory);

  it('Creates subqueries', () => {
    Query.factory = assignIn(sinon.spy(), Query.factory)

    let query = Query.factory.object({
      a: 'a',
      b: 'b'
    });

    assert(Query.factory.withArgs('a').calledOnce);
    assert(Query.factory.withArgs('b').calledOnce);
  });

  it('Executes subqueries correctly', () => {
    Query.factory = assignIn(sinon.stub(), Query.factory);
    Query.factory.withArgs('a').returns(subOne);
    Query.factory.withArgs('b').returns(subTwo);

    let expSubOne = sinon.mock(subOne).expects('on').once().withArgs('document');
    let expSubTwo = sinon.mock(subTwo).expects('on').once().withArgs('document');

    let query = Query.factory.object({
      a: 'a',
      b: 'b'
    });

    return query
      .on('document')
      .then(_ => expSubOne.verify())
      .then(_ => expSubTwo.verify());
  });

  it('Constructs an object correctly', () => {
    Query.factory = assignIn(sinon.stub(), Query.factory)
    Query.factory.withArgs('a').returns(subOne);
    Query.factory.withArgs('b').returns(subTwo);

    sinon.stub(subOne, 'on').returns('a');
    sinon.stub(subTwo, 'on').returns('b');

    let query = Query.factory.object({
      a: 'a',
      b: 'b'
    });

    return query
      .on('document')
      .then(result => expect(result).to.eql({a: 'a', b: 'b'}));
  });

});


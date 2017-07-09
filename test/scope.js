const helper = require('./helper');
const Query = require('../query');
const originalFactory = Query.factory;

describe('scope', () => {

  let Scope, queryMock;

  beforeEach(() => {
    Query.factory = {};

    for (let type in originalFactory) {
      Query.factory[type] = sinon.mock();
    }

    Scope = proxyquire('../scope', {
      './query': Query
    });
  });

  afterEach(() => Query.factory = originalFactory);

  it('Creates a scope given a document', () => {
    let scope = Scope.factory('document');
    expect(scope).to.be.an.instanceof(Scope);
  });

  it('Returns a scope if one is already provided', () => {
    let scope = Scope.factory('document');
    let other = Scope.factory(scope);
    expect(scope).to.equal(other);
  });

  it('Correctly sets the given document', () => {
    let scope = Scope.factory('document');
    expect(scope.document()).to.equal('document');
  });

  it('Correctly executes a given query', () => {
    let scope = Scope.factory('document');
    let query = originalFactory.base('path');
    let expOn = sinon.mock(query).expects('on').once().withArgs('document').returns('result');
    
    expect(scope.execute(query)).to.equal('result');
    expOn.verify();
  });

  it('Has methods to generate and execute all query types', () => {
    let scope = Scope.factory('document');

    for (let type in Query.factory) {
      expect(scope[type]).to.be.a('function');
    }
  });

  it('Correctly generates and executes all query types', () => {
    let scope = Scope.factory('document');

    for (let type in Query.factory) {
      let options = {};
      let query = originalFactory.base('path');
      let expOn = sinon.mock(query).expects('on').once().withArgs('document').returns('result');
      Query.factory[type].once().withArgs('path', options).returns(query);
      expect(scope[type]('path', options)).to.equal('result');
      Query.factory[type].verify();
    }
  }); 

});


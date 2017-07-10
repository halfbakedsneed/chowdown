const helper = require('./helper');

const Scope = require('../scope');
const Query = require('../query');
const sandbox = sinon.sandbox.create();

describe('scope', () => {

  afterEach(() => sandbox.verifyAndRestore());

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
    let query = Query.factory.base('path');

    sandbox.mock(query).expects('on').once().withArgs('document').returns('result');
    expect(scope.execute(query)).to.equal('result');
  });

  it('Has methods to generate and execute all query types', () => {
    let scope = Scope.factory('document');

    for (let type in Query.factory) {
      expect(scope[type]).to.be.a('function');
    }
  });

  it('Correctly generates and executes all query types', () => {
    let query = Query.factory.base('path');
    let options = {};
    let count = 0;

    for (let type in Query.factory) {
      count++;
      sandbox.mock(Query.factory).expects(type).once().withArgs('path', options).returns(query);
    }

    sandbox.mock(query).expects('on').exactly(count).withArgs('document').returns('result');

    let Scope = proxyquire('../scope', {
      './query': Query
    });

    let scope = Scope.factory('document');
    
    for (let type in Query.factory) {
      expect(scope[type]('path', options)).to.equal('result');
    }
  }); 

});



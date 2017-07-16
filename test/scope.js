const helper = require('./helper');
const Scope = require('../src/scope');
const Query = require('../src/query');
const { omit, functions } = require('lodash'); 
const sandbox = sinon.sandbox.create();

describe('scope', () => {

  let queryTypes = functions(Query.factory);

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
    let query = Query.factory('selector');

    sandbox.mock(query).expects('on').once().withArgs('document').returns('result');
    expect(scope.execute(query)).to.equal('result');
  });

  it('Has methods to generate and execute all query types', () => {
    let scope = Scope.factory('document');

    for (let type of queryTypes) {
      expect(scope[type]).to.be.a('function');
    }
  });

  it('Correctly generates and executes all query types', () => {
    let query = Query.factory('selector');
    let options = {};

    for (let type of queryTypes) {
      sandbox.mock(Query.factory).expects(type).once().withArgs('selector', options).returns(query);
    }

    sandbox.mock(query).expects('on').exactly(queryTypes.length).withArgs('document').returns('result');

    let Scope = proxyquire('../src/scope', {
      './query': Query
    });

    let scope = Scope.factory('document');
    
    for (let type of queryTypes) {
      expect(scope[type]('selector', options)).to.equal('result');
    }
  }); 

});



const helper = require('./helper');
const Scope = require('../scope');
const retrieve = require('../retrieve')


describe('elicit', () => {

  let elicit = require('../'), scopeMock, retrieveMock;

  beforeEach(() => {
    scopeMock = sinon.mock(Scope);
    retrieveMock = sinon.mock(retrieve);
  });

  afterEach(() => {
    scopeMock.restore();
    retrieveMock.restore();
  });

  it('Returns a scope given a body', () => {
    let expRetrieve = retrieveMock.expects('body').once().withArgs('body').returns('document');
    let expScope = scopeMock.expects('factory').once().withArgs('document').returns('scope');
    expect(elicit.body('body')).to.equal('scope');
    expScope.verify();
    expRetrieve.verify();
  });

  it('Returns a scope given a filename', () => {
    let expRetrieve = retrieveMock.expects('file').once().withArgs('file').returns('document');
    let expScope = scopeMock.expects('factory').once().withArgs('document').returns('scope');
    expect(elicit.file('file')).to.equal('scope');
    expScope.verify();
    expRetrieve.verify();
  });

  it('Returns a scope given a request', () => {
    let expRetrieve = retrieveMock.expects('request').once().withArgs('request').returns('document');
    let expScope = scopeMock.expects('factory').once().withArgs('document').returns('scope');
    expect(elicit.request('request')).to.equal('scope');
    expScope.verify();
    expRetrieve.verify();
  });

  it('Uses the request method by default', () => {
    let expRetrieve = retrieveMock.expects('request').once().withArgs('request').returns('document');
    let expScope = scopeMock.expects('factory').once().withArgs('document').returns('scope');
    expect(elicit('request')).to.equal('scope');
    expScope.verify();
    expRetrieve.verify();
  });

  

});


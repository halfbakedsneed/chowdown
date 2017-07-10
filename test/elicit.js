const helper = require('./helper');

const elicit = require('../elicit');
const Scope = require('../scope');
const retrieve = require('../retrieve');
const sandbox = sinon.sandbox.create();


describe('elicit', () => {

  beforeEach(() => {
    scopeMock = sinon.mock(Scope);
    retrieveMock = sinon.mock(retrieve);
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it('Returns a scope given a body', () => {
    sandbox.mock(retrieve).expects('body').once().withArgs('body').returns('document');
    sandbox.mock(Scope).expects('factory').once().withArgs('document').returns('scope');

    expect(elicit.body('body')).to.equal('scope');
  });

  it('Returns a scope given a filename', () => {
    sandbox.mock(retrieve).expects('file').once().withArgs('file').returns('document');
    sandbox.mock(Scope).expects('factory').once().withArgs('document').returns('scope');

    expect(elicit.file('file')).to.equal('scope');
  });

  it('Returns a scope given a request', () => {
    sandbox.mock(retrieve).expects('request').once().withArgs('request').returns('document');
    sandbox.mock(Scope).expects('factory').once().withArgs('document').returns('scope');

    expect(elicit.request('request')).to.equal('scope');
  });

  it('Uses the request method by default', () => {
    sandbox.mock(retrieve).expects('request').once().withArgs('request').returns('document');
    sandbox.mock(Scope).expects('factory').once().withArgs('document').returns('scope');

    expect(elicit('request')).to.equal('scope');
  });

});


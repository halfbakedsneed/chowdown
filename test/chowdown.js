const helper = require('./helper');
const chowdown = require('../src/chowdown');
const Scope = require('../src/scope');
const Query = require('../src/query');
const retrieve = require('../src/retrieve');
const sandbox = sinon.sandbox.create();


describe('chowdown', () => {

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it('Returns a scope given a body', () => {
    sandbox.mock(retrieve).expects('body').once().withArgs('body').returns('document');
    sandbox.mock(Scope).expects('factory').once().withArgs('document').returns('scope');

    expect(chowdown.body('body')).to.equal('scope');
  });

  it('Returns a scope given a filename', () => {
    sandbox.mock(retrieve).expects('file').once().withArgs('file').returns('document');
    sandbox.mock(Scope).expects('factory').once().withArgs('document').returns('scope');

    expect(chowdown.file('file')).to.equal('scope');
  });

  it('Returns a scope given a request', () => {
    sandbox.mock(retrieve).expects('request').once().withArgs('request').returns('document');
    sandbox.mock(Scope).expects('factory').once().withArgs('document').returns('scope');

    expect(chowdown.request('request')).to.equal('scope');
  });

  it('Uses the request method by default', () => {
    sandbox.mock(retrieve).expects('request').once().withArgs('request').returns('document');
    sandbox.mock(Scope).expects('factory').once().withArgs('document').returns('scope');

    expect(chowdown('request')).to.equal('scope');
  });

  it('Has the correct methods to create all types of queries', () => {

    for (let type in Query.factory) {
      expect(Query.factory[type]).to.eql(chowdown.query[type]);
    }

  });

});


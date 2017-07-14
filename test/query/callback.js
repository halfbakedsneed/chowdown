const helper = require('../helper');
const Query = require('../../src/query');
const Scope = require('../../src/scope');
const sandbox = sinon.sandbox.create();

describe('callback query', () => {

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it('Creates a scope with the given document', () => {
    sandbox.mock(Scope).expects('factory').once().withArgs('document').returns('scope');

    return Query.factory.callback(sandbox.stub())
      .on('document');
  });

  it('Calls the callback with the created scope', () => {
    sandbox.stub(Scope, 'factory').returns('scope');

    let callback = sandbox.spy();

    return Query.factory.callback(callback)
      .on('document')
      .then(_ => callback.withArgs('scope').calledOnce);
  });

  it('Returns the result of the callback', () => {
    sandbox.stub(Scope, 'factory').returns('scope');

    return Query.factory.callback(sandbox.stub().returns('result'))
      .on('document')
      .then(result => expect(result).to.equal('result'));
  });

});


const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../query');
const Scope = require('../../scope');


describe('callback query', () => {

  it('Creates a scope with the given document', () => {
    let scopeMock = sinon.mock(Scope);
    let expScope = scopeMock.expects('factory').once().withArgs('document').returns('scope');

    return Query.factory.callback(sinon.stub())
      .on('document')
      .then(_ => expScope.verify())
      .then(_ => scopeMock.restore());
  });

  it('Calls the callback with the created scope', () => {
    let stub = sinon.stub(Scope, 'factory').returns('scope');

    let callbackSpy = sinon.spy();

    return Query.factory.callback(callbackSpy)
      .on('document')
      .then(_ => callbackSpy.withArgs('scope').calledOnce)
      .then(_ => stub.restore());
  });

  it('Returns the result of the callback', () => {
    let stub = sinon.stub(Scope, 'factory').returns('scope');

    return Query.factory.callback(sinon.stub().returns('result'))
      .on('document')
      .then(result => expect(result).to.equal('result'))
      .then(_ => stub.restore());
  });


  
});


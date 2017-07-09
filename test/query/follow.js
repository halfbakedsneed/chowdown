const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const retrieve = require('../../retrieve');
const Query = require('../../query');
const Document = require('../../document');
const originalFactory = Query.factory;


describe('follow query', () => {

  let retrieveMock, doc, uri, sub;

  beforeEach(() => {
    retrieveMock = sinon.mock(retrieve);
    doc = new Document();
    uri = Query.factory.base('path');
    sub = Query.factory.base('path');
  });

  afterEach(() => Query.factory = originalFactory);

  it('Creates the subqueries correctly', () => {
    Query.factory = assignIn(sinon.spy(), Query.factory);
    Query.factory.follow('uri', 'sub');

    assert(Query.factory.withArgs('sub').calledOnce);
    assert(Query.factory.withArgs('uri', Query.factory.link).calledOnce);
  });

  it('Attempts to find the uri', () => {
    Query.factory = assignIn(sinon.stub(), Query.factory);

    Query.factory.withArgs('uri').returns(uri);
    Query.factory.withArgs('sub').returns(sub);

    let expUri = sinon.mock(uri).expects('on').once().withArgs('document').resolves('uri');
    sinon.stub(sub, 'on').resolves('result');

    let retrieveStub = sinon.stub(retrieve, 'request').returns('document');    

    return Query.factory.follow('uri', 'sub')
      .on('document')
      .then(_ => expUri.verify())
      .then(_ => retrieveStub.restore());
  });

  it('Passes the uri and options to the retrieve method', () => {
    Query.factory = assignIn(sinon.stub(), Query.factory);

    Query.factory.withArgs('uri').returns(uri);
    Query.factory.withArgs('sub').returns(sub);

    sinon.stub(uri, 'on').resolves('uri');
    sinon.stub(sub, 'on').resolves('result');

    let retrieveMock = sinon.mock(retrieve);
    let expRetrieve = retrieveMock.expects('request')
      .once()
      .withArgs({
        uri: 'uri' 
      }, sinon.match({
        client: 'client'
      }))
      .returns('result');

    return Query.factory.follow('uri', 'sub', {
      client: 'client'
    })
      .on('document')
      .then(_ => expRetrieve.verify())
      .then(_ => retrieveMock.restore());
  });

  it('Attempts to execute the subquery', () => {
    Query.factory = assignIn(sinon.stub(), Query.factory);

    Query.factory.withArgs('uri').returns(uri);
    Query.factory.withArgs('sub').returns(sub);

    sinon.stub(uri, 'on').resolves('uri');
    let expSub = sinon.mock(sub).expects('on').once().withArgs('document').resolves('result');

    let retrieveStub = sinon.stub(retrieve, 'request').returns('document');    

    return Query.factory.follow('uri', 'sub')
      .on('document')
      .then(_ => expSub.verify())
      .then(_ => retrieveStub.restore());
  });

  it('Returns the default value if an error is thrown', () => {
    Query.factory = assignIn(sinon.stub(), Query.factory);

    Query.factory.withArgs('uri').returns(uri);
    Query.factory.withArgs('sub').returns(sub);

    sinon.stub(uri, 'on').resolves('uri');
    sinon.stub(sub, 'on').resolves('result');

    let retrieveStub = sinon.stub(retrieve, 'request').rejects('document');    

    return Query.factory.follow('uri', 'sub', {
      default: 'def'
    })
      .on('document')
      .then(result => expect(result).to.equal('def'))
      .then(_ => retrieveStub.restore());
  });

});


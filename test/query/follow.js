const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const retrieve = require('../../retrieve');
const Query = require('../../query');
const Document = require('../../document');
const sandbox = sinon.sandbox.create();


describe('follow query', () => {

  afterEach(() => sandbox.verifyAndRestore());

  it('Creates the subqueries correctly', () => {
    let factory = sandbox.spy(Query, 'factory');
    Query.factory.follow('uri', 'sub');

    assert(factory.withArgs('sub').calledOnce);
    assert(factory.withArgs('uri', Query.factory.uri).calledOnce);
  });

  it('Attempts to find the uri', () => {
    let factory = sandbox.stub(Query, 'factory');

    let uriQuery = Query.factory.base();
    let subQuery = Query.factory.base();

    factory.withArgs('uri').returns(uriQuery);
    factory.withArgs('sub').returns(subQuery);

    sandbox.stub(subQuery, 'on').resolves('inner');
    sandbox.stub(retrieve, 'request').resolves('other document');

    sandbox.mock(uriQuery).expects('on').once().withArgs('document').resolves('uri');

    let query = Query.factory.follow('uri', 'sub');
    
    return query.on('document');
  });

  it('Passes the uri and options to the retrieve method', () => {
    let factory = sandbox.stub(Query, 'factory');

    let uriQuery = Query.factory.base();
    let subQuery = Query.factory.base();

    factory.withArgs('uri').returns(uriQuery);
    factory.withArgs('sub').returns(subQuery);

    sandbox.stub(subQuery, 'on').resolves('inner');
    sandbox.stub(uriQuery, 'on').resolves('uri');

    sandbox.mock(retrieve)
      .expects('request')
      .once()
      .withArgs({
        uri: 'uri',
        method: 'method'
      }, sinon.match({
        type: 'type',
        client: 'client'
      }))
      .resolves('other document');

    let query = Query.factory.follow('uri', 'sub', {
      request: {
        method: 'method'
      },
      type: 'type',
      client: 'client'
    });

    return query.on('document');
  });

  it('Attempts to execute and returns the subquery', () => {
    let factory = sandbox.stub(Query, 'factory');

    let uriQuery = Query.factory.base();
    let subQuery = Query.factory.base();

    factory.withArgs('uri').returns(uriQuery);
    factory.withArgs('sub').returns(subQuery);

    sandbox.stub(uriQuery, 'on').resolves('uri');
    sandbox.stub(retrieve, 'request').resolves('other document');

    sandbox.mock(subQuery).expects('on').once().withArgs('other document').resolves('inner');

    let query = Query.factory.follow('uri', 'sub');
    
    return query.on('document')
      .then(result => expect(result).to.equal('inner'));
  });

  it('Returns the default value if an error is thrown', () => {
    let factory = sandbox.stub(Query, 'factory');

    let uriQuery = Query.factory.base();
    let subQuery = Query.factory.base();

    factory.withArgs('uri').returns(uriQuery);
    factory.withArgs('sub').returns(subQuery);

    sandbox.stub(subQuery, 'on').resolves('inner');
    sandbox.stub(retrieve, 'request').rejects('error');

    let query = Query.factory.follow('uri', 'sub');
    
    return query.on('document')
      .then(result => expect(result).to.equal(undefined));
  });

});


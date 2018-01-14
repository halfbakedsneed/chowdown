const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const retrieve = require('../../src/retrieve');
const Query = require('../../src/query');
const Document = require('../../src/document');
const sandbox = sinon.sandbox.create();


describe('paginate query', () => {

  afterEach(() => sandbox.verifyAndRestore());

  it('Correctly retrieves and parses multiple pages', () => {
    let uriQuery = Query.factory();
    let subQuery = Query.factory();

    let factory = sandbox.stub(Query, 'factory');

    factory.withArgs('uri').returns(uriQuery);
    factory.withArgs('sub').returns(subQuery);

    let subStub = sandbox.stub(subQuery, 'on');
    subStub.withArgs('document').resolves('first');
    subStub.withArgs('other document').resolves('second');

    let uriStub = sandbox.stub(uriQuery, 'on');
    uriStub.withArgs('document').resolves('uri');
    uriStub.withArgs('other document').resolves(false);

    let requestStub = sandbox.stub(retrieve, 'request');
    requestStub.withArgs(sinon.match({ uri: 'uri' })).resolves('other document');
    
    let query = Query.factory.paginate('sub', 'uri');

    return query.on('document')
      .then(result => expect(result).to.eql(['first', 'second']));
  });

  it('Correctly uses a custom merge function', () => {
    let uriQuery = Query.factory();
    let subQuery = Query.factory();

    let factory = sandbox.stub(Query, 'factory');

    factory.withArgs('uri').returns(uriQuery);
    factory.withArgs('sub').returns(subQuery);

    let subStub = sandbox.stub(subQuery, 'on');
    subStub.withArgs('document').resolves('first');
    subStub.withArgs('other document').resolves('second');

    let uriStub = sandbox.stub(uriQuery, 'on');
    uriStub.withArgs('document').resolves('uri');
    uriStub.withArgs('other document').resolves(false);

    let requestStub = sandbox.stub(retrieve, 'request');
    requestStub.withArgs(sinon.match({ uri: 'uri' })).resolves('other document');
    
    let query = Query.factory.paginate('sub', 'uri', 0, {
      merge: sandbox.mock().once().withArgs(['first', 'second']).returns('merged')
    });

    return query.on('document')
      .then(result => expect(result).to.equal('merged'));
  });

  it('Correctly stops using max pages value', () => {
    let uriQuery = Query.factory();
    let subQuery = Query.factory();

    let factory = sandbox.stub(Query, 'factory');

    factory.withArgs('uri').returns(uriQuery);
    factory.withArgs('sub').returns(subQuery);

    let subStub = sandbox.stub(subQuery, 'on');
    subStub.withArgs('document').resolves('first');
    subStub.withArgs('other document').resolves('second');

    let uriStub = sandbox.stub(uriQuery, 'on');
    uriStub.withArgs('document').resolves('uri');
    uriStub.withArgs('other document').resolves(false);

    let requestStub = sandbox.stub(retrieve, 'request');
    requestStub.withArgs(sinon.match({ uri: 'uri' })).resolves('other document');
    
    let query = Query.factory.paginate('sub', 'uri', 1);

    return query.on('document')
      .then(result => expect(result).to.eql(['first']));
  });

  it('Correctly stops using max pages function', () => {
    let uriQuery = Query.factory();
    let subQuery = Query.factory();

    let factory = sandbox.stub(Query, 'factory');

    factory.withArgs('uri').returns(uriQuery);
    factory.withArgs('sub').returns(subQuery);

    let subStub = sandbox.stub(subQuery, 'on');
    subStub.withArgs('document').resolves('first');
    subStub.withArgs('other document').resolves('second');

    let uriStub = sandbox.stub(uriQuery, 'on');
    uriStub.withArgs('document').resolves('uri');
    uriStub.withArgs('other document').resolves(false);

    let requestStub = sandbox.stub(retrieve, 'request');
    requestStub.withArgs(sinon.match({ uri: 'uri' })).resolves('other document');
    
    let query = Query.factory.paginate('sub', 'uri', (a) => a < 1);

    return query.on('document')
      .then(result => expect(result).to.eql(['first']));
  });

});


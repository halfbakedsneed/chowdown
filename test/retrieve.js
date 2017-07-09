const helper = require('./helper');
const Document = require('../document');
const fs = require('fs');

describe('retrieve', () => {

  let retrieve, documentMock, fsMock, expRp, expReadFile;

  beforeEach(() => {
    expRp = sinon.mock();
    documentFactoryMock = sinon.mock(Document.factory);
    fsMock = sinon.mock(fs);
    expReadFile = fsMock.expects('readFile');

    retrieve = proxyquire('../retrieve', {
      'request-promise': expRp
    });
  });


  afterEach(() => {
    documentFactoryMock.restore();
    fsMock.restore();
  });

  it('should use the default client for a request if none is provided', () => {
    expRp.once().withArgs('request').returns({ promise: () => Promise.resolve() });
    documentFactoryMock.expects('dom').returns('document');
    return retrieve
      .request('request')
      .then(_ => expRp.verify());
  });

  it('should use the default document type if none is provided', () => {
    let expDom = documentFactoryMock.expects('dom').once().withArgs('body').returns('document');
    return retrieve
      .body('body')
      .then(_ => expDom.verify());
  });

  it('should provide the client with the correct request', () => {
    let expClient = sinon.mock().once().withArgs('request').resolves('body');
    documentFactoryMock.expects('dom').returns('document');
    return retrieve
      .request('request', {
        client: expClient
      })
      .then(_ => expClient.verify());
  });

  it('should read the correct file', () => {
    expReadFile.once().withArgs('file').callsArgWith(1, null, 'body');
    documentFactoryMock.expects('dom').returns('document');
    return retrieve
      .file('file')
      .then(_ => expReadFile.verify());
  });

  it('should create a document with the correct body', () => {
    let expJson = documentFactoryMock.expects('json').once().withArgs('body').returns('document');
    return retrieve
      .body('body', {
        type: 'json'
      })
      .then(result => expect(result).to.equal('document'));
  });

  it('should create a document with the correct file contents', () => {
    let expJson = documentFactoryMock.expects('json').once().withArgs('body').returns('document');
    expReadFile.withArgs('file').callsArgWith(1, null, 'body');
    return retrieve
      .file('file', {
        type: 'json'
      })
      .then(result => expect(result).to.equal('document'));
  });

  it('should create the document with the correct request response', () => {
    let expJson = documentFactoryMock.expects('json').once().withArgs('body').returns('document');
    return retrieve
      .request('request', {
        client: sinon.stub().resolves('body'),
        type: 'json'
      })
      .then(result => expect(result).to.equal('document'));
  });

});


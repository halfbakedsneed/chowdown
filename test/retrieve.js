const helper = require('./helper');

const retrieve = require('../src/retrieve');
const Document = require('../src/document');
const fs = require('fs');
const sandbox = sinon.sandbox.create();

describe('retrieve', () => {

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it('should use the default client for a request if none is provided', () => {
    let retrieve = proxyquire('../src/retrieve', {
      'request-promise': sandbox
        .mock()
        .once()
        .withArgs('request')
        .returns({ promise: () => Promise.resolve() })
    });

    sandbox.stub(Document.factory, 'dom');

    return retrieve.request('request');
  });

  it('should always use the dom document type', () => {
    sandbox.mock(Document.factory).expects('dom').once().withArgs('body');

    return retrieve.body('body', {
      type: 'json'
    });
  });

  it('should provide the client with the correct request', () => {
    sandbox.stub(Document.factory, 'dom');

    return retrieve.request('request', {
      client: sandbox.mock().once().withArgs('request').resolves()
    });
  });

  it('should read the correct file', () => {
    sandbox.stub(Document.factory, 'dom');
    sandbox.mock(fs).expects('readFile').once().withArgs('file').callsArgWith(1, null, 'body');

    let retrieve = proxyquire('../src/retrieve', {
      'fs': fs
    });

    return retrieve.file('file');
  });

  it('should create a document with the correct body', () => {
    sandbox.mock(Document.factory).expects('dom').once().withArgs('body').returns('document');

    return retrieve
      .body('body')
      .then(result => expect(result).to.equal('document'));
  });

  it('should create a document with the correct file contents', () => {
    sandbox.mock(Document.factory).expects('dom').once().withArgs('body').returns('document');
    sandbox.stub(fs, 'readFile').callsArgWith(1, null, 'body');

    let retrieve = proxyquire('../src/retrieve', {
      'fs': fs
    });

    return retrieve
      .file('file')
      .then(result => expect(result).to.equal('document'));
  });

  it('should create the document with the correct request response', () => {
    sandbox.mock(Document.factory).expects('dom').once().withArgs('body').returns('document');

    return retrieve
      .request('request', {
        client: sandbox.stub().resolves('body')
      })
      .then(result => expect(result).to.equal('document'));
  });

});


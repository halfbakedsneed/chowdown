const helper = require('../helper');
const Document = require('../../src/document');
const sandbox = sinon.sandbox.create();

describe('base document', () => {

  afterEach(() => sandbox.verifyAndRestore());

  it('Has default concrete methods', () => {
    let document = new Document();

    expect(document.queryChildren).to.be.a('function');
    expect(document.queryValue).to.be.a('function');
    expect(document.queryRaw).to.be.equal(undefined);
    expect(document.queryUri).to.be.a('function');
    expect(document.formatSelector).to.be.a('function');
    expect(document.loadDocument).to.be.a('function');
    expect(document.loadRoot).to.be.a('function');
  });

  it('Has concrete query methods that all attempt to call the main concrete query method by default', () => {
    let document = new Document();
    document.query = (() => undefined);

    let query = sandbox.spy(document, 'query');

    document.children('childSelector');
    document.value('valueSelector');
    document.uri('uriSelector');

    assert(query.withArgs('childSelector').calledOnce);
    assert(query.withArgs('valueSelector').calledOnce);
    assert(query.withArgs('uriSelector').calledOnce);
  });

  it('Has a formatSelector method that returns the given selector by default', () => {
    let document = new Document();
    document.query = (() => undefined);

    sandbox.mock(document).expects('queryChildren').once().withArgs('childSelector');
    sandbox.mock(document).expects('queryValue').once().withArgs('valueSelector');
    sandbox.mock(document).expects('queryUri').once().withArgs('uriSelector');

    document.children('childSelector');
    document.value('valueSelector');
    document.uri('uriSelector');
  });

  it('Throws an error when queried because it\'s an abstract class', () => {
    let document = new Document();

    expect(() => document.children('selector')).to.throw();
    expect(() => document.value('selector')).to.throw();
    expect(() => document.uri('selector')).to.throw();
  });

  it('Has factory methods for all document types', () => {
    let types = [
      'dom'
    ];

    for (let type of types) {
      expect(Document.factory[type]).to.be.a('function');
    }
  });

  it('Correctly creates document subtypes', () => {
    let construction = {
      dom: ''
    };

    for (let type in Document.factory) {
      expect(Document.factory[type](construction[type]).options.type).to.equal(type);
    } 
  });


});


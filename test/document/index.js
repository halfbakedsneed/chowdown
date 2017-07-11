const helper = require('../helper');
const Document = require('../../document');
const sandbox = sinon.sandbox.create();

describe('base document', () => {

  afterEach(() => sandbox.verifyAndRestore());

  it('Has default concrete methods', () => {
    let document = new Document();

    expect(document.queryChildren).to.be.a('function');
    expect(document.queryValue).to.be.a('function');
    expect(document.queryRaw).to.be.equal(undefined);
    expect(document.queryLink).to.be.a('function');
    expect(document.formatPath).to.be.a('function');
    expect(document.loadDocument).to.be.a('function');
    expect(document.loadRoot).to.be.a('function');
  });

  it('Has concrete query methods that all attempt to call the main concrete query method by default', () => {
    let document = new Document();
    document.query = (() => undefined);

    let query = sandbox.spy(document, 'query');

    document.children('childPath');
    document.value('valuePath');
    document.link('linkPath');

    assert(query.withArgs('childPath').calledOnce);
    assert(query.withArgs('valuePath').calledOnce);
    assert(query.withArgs('linkPath').calledOnce);
  });

  it('Has a formatPath method that returns the given path by default', () => {
    let document = new Document();
    document.query = (() => undefined);

    sandbox.mock(document).expects('queryChildren').once().withArgs('childPath');
    sandbox.mock(document).expects('queryValue').once().withArgs('valuePath');
    sandbox.mock(document).expects('queryLink').once().withArgs('linkPath');

    document.children('childPath');
    document.value('valuePath');
    document.link('linkPath');
  });

  it('Throws an error when queried because it\'s an abstract class', () => {
    let document = new Document();

    expect(() => document.children('path')).to.throw();
    expect(() => document.value('path')).to.throw();
    expect(() => document.link('path')).to.throw();
  });

  it('Has factory methods for all document types', () => {
    let types = [
      'dom',
      'json'
    ];

    for (let type of types) {
      expect(Document.factory[type]).to.be.a('function');
    }
  });

  it('Correctly creates document subtypes', () => {
    let construction = {
      dom: '',
      json: {}
    };

    for (let type in Document.factory) {
      expect(Document.factory[type](construction[type]).options.type).to.equal(type);
    } 
  });


});


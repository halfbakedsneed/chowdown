const helper = require('../helper');
const Document = require('../../document');
const sandbox = sinon.sandbox.create();

describe('json document', () => {


  afterEach(() => sandbox.verifyAndRestore());


  it('Can extract a value from a string json object', () => {
    let document = Document.factory.json('{"a": "b"}');
    expect(document.value('a')).to.equal('b');
  });

  it('Can extract a value from a plain object', () => {
    let document = Document.factory.json({"a": "b"});
    expect(document.value('a')).to.equal('b');
  });

  it('Can extract children from the document', () => {
    let document = Document.factory.json('{"a": [{"b": "c"}]}');

    sandbox.mock(Document.factory).expects('json').once().withArgs({"a": [{"b": "c"}]}, {"b": "c"}).returns('child');

    expect(document.children('a')).to.eql(['child']);
  });

  it('Returns undefined if child not document or array', () => {
    let document = Document.factory.json('{"a": ["c"]}');
    expect(document.children('a')).to.equal(undefined);
  });

  it('Can handle the execution of functions', () => {
    let document = Document.factory.json('{"a": ["c"]}');
    let fn = sandbox.mock();

    fn.once().withArgs({"a": ["c"]}, {"a": ["c"]}).returns('result');

    expect(document.raw(fn)).to.equal('result');
  });


});


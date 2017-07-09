const helper = require('../helper');
let Document = require('../../document');

describe('json document', () => {


  it('Can extract a value from the document', () => {
    let document = Document.factory.json('{"a": "b"}');
    expect(document.value('a')).to.equal('b');
  });

  it('Can extract children from the document', () => {
    let document = Document.factory.json('{"a": [{"b": "c"}]}');

    let docMock = sinon.mock(Document.factory);
    docMock.expects('json').once().withArgs({"a": [{"b": "c"}]}, {"b": "c"}).returns('child');

    expect(document.children('a')).to.eql(['child']);

    docMock.verify();
    docMock.restore();
  });

  it('Returns undefined if child not document or array', () => {
    let document = Document.factory.json('{"a": ["c"]}');
    expect(document.children('a')).to.equal(undefined);
  });

  it('Can handle the execution of functions', () => {
    let document = Document.factory.json('{"a": ["c"]}');

    let fnMock = sinon.mock();

    fnMock.once().withArgs({"a": ["c"]}, {"a": ["c"]}).returns('result');

    expect(document.raw(fnMock)).to.equal('result');

    fnMock.verify();
  });


});


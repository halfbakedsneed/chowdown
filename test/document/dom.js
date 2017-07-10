const helper = require('../helper');
const Document = require('../../document');
const cheerio = require('cheerio');
const sandbox = sinon.sandbox.create();

describe('dom document', () => {

  afterEach(() => sandbox.verifyAndRestore());

  let createElement = (length=1) => {
    let element = cheerio();
    element.length = length;

    return element;
  }

  it('Loads the body correctly from a string', () => {
    let manipulator = sandbox.stub();

    sandbox.mock(cheerio).expects('load').once().withArgs('body').returns(manipulator);
    
    let document = Document.factory.dom('body', 'root');
  });

  it('Loads the body correctly from a cheerio instance', () => {
    let manipulator = sandbox.stub();
    let body = sinon.createStubInstance(cheerio);

    sandbox.mock(cheerio).expects('load').once().withArgs(body).returns(manipulator);
    
    let document = Document.factory.dom(body, 'root');
  });

  it('Loads the root correctly', () => {
    sandbox.stub(cheerio, 'load').returns(
      sandbox.mock().once().withArgs('root')
    );

    let document = Document.factory.dom('body', 'root');
  });

  it('Correctly queries using cheerio', () => {
    let manipulator = sandbox.stub();

    manipulator.withArgs('root').returns('root');
    manipulator.withArgs('path').returns('result');

    sandbox.stub(cheerio, 'load').returns(manipulator);

    let document = Document.factory.dom('body', 'root');

    document.value('path');

    assert(manipulator.withArgs('path').calledOnce);
  });

  it('Can extract a value from the document (text)', () => {
    let manipulator = sandbox.stub();
    let element = createElement();

    manipulator.withArgs('root').returns('root');
    manipulator.withArgs('path').returns(element);

    sandbox.stub(cheerio, 'load').returns(manipulator);

    sandbox.mock(element).expects('text').atLeast(1).returns('result');

    let document = Document.factory.dom('body', 'root');

    expect(document.value('path')).to.equal('result');
  });

  it('Can extract a value from the document (attr)', () => {
    let manipulator = sandbox.stub();
    let element = createElement();

    manipulator.withArgs('root').returns('root');
    manipulator.withArgs('path').returns(element);

    sandbox.stub(cheerio, 'load').returns(manipulator);

    sandbox.mock(element).expects('attr').withArgs('attr').atLeast(1).returns('result');

    let document = Document.factory.dom('body', 'root');

    expect(document.value('path/attr')).to.equal('result');
  });

  it('Can handle the execution of functions', () => {
    let manipulator = sandbox.stub();
    manipulator.withArgs('root').returns('root');

    let fn = sandbox.mock();
    fn.once().withArgs(manipulator, 'root').returns('result');

    sandbox.stub(cheerio, 'load').returns(manipulator);
    
    let document = Document.factory.dom('body', 'root');

    expect(document.raw(fn)).to.equal('result');
  });

  it('Extracts a link from the document', () => {
    let manipulator = sandbox.stub();
    let element = createElement();

    manipulator.withArgs('root').returns('root');
    manipulator.withArgs('path').returns(element);

    sandbox.stub(cheerio, 'load').returns(manipulator);

    sandbox.mock(element).expects('attr').withArgs('href').atLeast(1).returns('result');

    let document = Document.factory.dom('body', 'root');

    expect(document.link('path')).to.equal('result');
  });

  it('Extracts children from the document', () => {
    let manipulator = sandbox.stub();
    let element = createElement();

    manipulator.withArgs('root').returns('root');
    manipulator.withArgs('path').returns(element);

    sandbox.stub(cheerio, 'load').returns(manipulator);
    sandbox.stub(element, 'toArray').returns(['a', 'b']);

    let document = Document.factory.dom('body', 'root');

    let factory = sandbox.stub(Document.factory, 'dom');

    factory.withArgs(manipulator, 'a').returns('a_doc');
    factory.withArgs(manipulator, 'b').returns('b_doc');

    expect(document.children('path')).to.eql(['a_doc', 'b_doc']);
    assert(factory.withArgs(manipulator, 'a').calledOnce);
    assert(factory.withArgs(manipulator, 'b').calledOnce);
  });


});


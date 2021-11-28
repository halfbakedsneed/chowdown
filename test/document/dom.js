const helper = require('../helper');
const cheerio = require('cheerio').default;
const Document = proxyquire('../src/document', {
  './dom': proxyquire('../src/document/dom', { cheerio })
});
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
    manipulator.withArgs('selector').returns('result');

    sandbox.stub(cheerio, 'load').returns(manipulator);

    let document = Document.factory.dom('body', 'root');

    document.value('selector');

    assert(manipulator.withArgs('selector').calledOnce);
  });

  it('Uses the root if no selector is given', () => {
    let manipulator = sandbox.stub();
    manipulator.withArgs('root').returns('root');

    sandbox.stub(cheerio, 'load').returns(manipulator);

    let document = Document.factory.dom('body', 'root');

    expect(document.value(undefined)).to.equal('root');
  });

  it('Can extract a value from the document (text)', () => {
    let manipulator = sandbox.stub();
    let element = createElement();

    manipulator.withArgs('root').returns('root');
    manipulator.withArgs('selector').returns(element);

    sandbox.stub(cheerio, 'load').returns(manipulator);

    sandbox.mock(element).expects('text').atLeast(1).returns('result');

    let document = Document.factory.dom('body', 'root');

    expect(document.value('selector')).to.equal('result');
  });

  it('Returns undefined if no element is found on a value query', () => {
    let manipulator = sandbox.stub();
    let element = createElement(0);

    manipulator.withArgs('root').returns('root');
    manipulator.withArgs('selector').returns(element);

    sandbox.stub(cheerio, 'load').returns(manipulator);

    let document = Document.factory.dom('body', 'root');

    expect(document.value('selector')).to.equal(undefined);
  });

  it('Can extract a value from the document (attr)', () => {
    let manipulator = sandbox.stub();
    let element = createElement();

    manipulator.withArgs('root').returns('root');
    manipulator.withArgs('selector').returns(element);

    sandbox.stub(cheerio, 'load').returns(manipulator);

    sandbox.mock(element).expects('attr').withArgs('attr').atLeast(1).returns('result');

    let document = Document.factory.dom('body', 'root');

    expect(document.value('selector/attr')).to.equal('result');
  });

  it('Returns undefined if the attr is not found on the element', () => {
    let manipulator = sandbox.stub();
    let element = createElement();

    manipulator.withArgs('root').returns('root');
    manipulator.withArgs('selector').returns(element);

    sandbox.stub(cheerio, 'load').returns(manipulator);
    sandbox.stub(element, 'attr').withArgs('attr').returns(undefined);

    let document = Document.factory.dom('body', 'root');

    expect(document.value('selector/attr')).to.equal(undefined);

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

  it('Extracts a uri from the document', () => {
    let manipulator = sandbox.stub();
    let element = createElement();

    manipulator.withArgs('root').returns('root');
    manipulator.withArgs('selector').returns(element);

    sandbox.stub(cheerio, 'load').returns(manipulator);

    sandbox.mock(element).expects('attr').withArgs('href').atLeast(1).returns('result');

    let document = Document.factory.dom('body', 'root');

    expect(document.uri('selector')).to.equal('result');
  });

  it('Extracts children from the document', () => {
    let manipulator = sandbox.stub();
    let element = createElement();

    manipulator.withArgs('root').returns('root');
    manipulator.withArgs('selector').returns(element);

    sandbox.stub(cheerio, 'load').returns(manipulator);
    sandbox.stub(element, 'toArray').returns(['a', 'b']);

    let document = Document.factory.dom('body', 'root');

    let factory = sandbox.stub(Document.factory, 'dom');

    factory.withArgs(manipulator, 'a').returns('a_doc');
    factory.withArgs(manipulator, 'b').returns('b_doc');

    expect(document.children('selector')).to.eql(['a_doc', 'b_doc']);
    assert(factory.withArgs(manipulator, 'a').calledOnce);
    assert(factory.withArgs(manipulator, 'b').calledOnce);
  });

  it('Returns undefined if no children are found', () => {
    let manipulator = sandbox.stub();
    let element = createElement(0);

    manipulator.withArgs('root').returns('root');
    manipulator.withArgs('selector').returns(element);

    sandbox.stub(cheerio, 'load').returns(manipulator);

    let document = Document.factory.dom('body', 'root');

    expect(document.children('selector')).to.equal(undefined);
  });


});


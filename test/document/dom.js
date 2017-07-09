const helper = require('../helper');
const Document = require('../../document');
const cheerio = require('cheerio');

describe('dom document', () => {

  let cheerioMock, expManipulator;

  beforeEach(() => {
    cheerioMock = sinon.mock(cheerio);
    expManipulator = sinon.mock();
  });

  afterEach(() => {
    cheerioMock.restore();
  });

  it('Loads itself correctly', () => {
    let expLoad = cheerioMock.expects('load').once().withArgs('body').returns(
      expManipulator
    );

    expManipulator.once().withArgs('root').returns('root');

    Document.factory.dom('body', 'root');

    expManipulator.verify();
    expLoad.verify();
  });

  it('Can extract a value from the document (text)', () => {
    cheerioMock.expects('load').returns(expManipulator);
    expManipulator.withArgs('root').returns('root');

    let document = Document.factory.dom('body', 'root');

    let element = cheerio();
    element.length = 1;

    let elementMock = sinon.mock(element);
    let expElement = elementMock.expects('text').atLeast(1).returns('value');
    
    expManipulator.reset();
    expManipulator.withArgs('path', 'root').returns(element);

    expect(document.value('path')).to.equal('value');

    expManipulator.verify();
    expElement.verify();
  });

  it('Can extract a value from the document (attr)', () => {
    cheerioMock.expects('load').returns(expManipulator);
    expManipulator.withArgs('root').returns('root');

    let document = Document.factory.dom('body', 'root');

    let element = cheerio();
    element.length = 1;

    let elementMock = sinon.mock(element);
    let expElement = elementMock.expects('attr').atLeast(1).withArgs('attr').returns('value');
    
    expManipulator.reset();
    expManipulator.withArgs('path', 'root').returns(element);

    expect(document.value('path/attr')).to.equal('value');

    expManipulator.verify();
    expElement.verify();
  });

  it('Can handle the execution of functions', () => {
    cheerioMock.expects('load').returns(expManipulator);
    expManipulator.withArgs('root').returns('root');

    let document = Document.factory.dom('body', 'root');

    let rawSpy = sinon.spy();

    document.raw(rawSpy);

    assert(rawSpy.withArgs(expManipulator, 'root').calledOnce);
  });

  it('Extracts a link from the document', () => {
    cheerioMock.expects('load').returns(expManipulator);
    expManipulator.withArgs('root').returns('root');

    let document = Document.factory.dom('body', 'root');

    let element = cheerio();
    element.length = 1;

    let elementMock = sinon.mock(element);
    let expElement = elementMock.expects('attr').atLeast(1).withArgs('href').returns('link');

    expManipulator.reset();
    expManipulator.withArgs('path', 'root').returns(element);

    expect(document.link('path')).to.equal('link');

    expElement.verify();
  });

  it('Extracts children from the document', () => {
    cheerioMock.expects('load').returns(expManipulator);
    expManipulator.withArgs('root').returns('root');

    let document = Document.factory.dom('body', 'root');

    let factoryMock = sinon.mock(Document.factory);
    let expDom = factoryMock.expects('dom').once().withArgs(expManipulator, 'element').returns('child');

    let element = cheerio();
    element.length = 1;

    let elementMock = sinon.mock(element);
    let expElement = elementMock.expects('toArray').returns(['element']);

    expManipulator.reset();
    expManipulator.withArgs('path', 'root').returns(element);

    expect(document.children('path')).to.eql(['child']);

    expElement.verify();
    expDom.verify();
    factoryMock.restore();
  });


});


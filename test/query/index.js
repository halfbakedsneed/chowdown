const helper = require('../helper');
const Query = require('../../query');
const Document = require('../../document');


describe('base query', () => {

  let doc;

  beforeEach(() => {
    doc = new Document();
  });

  it('Queries the document for the path', () => {
    let query = Query.factory.base('path');
    let expDoc = sinon.mock(doc).expects('value').once().withArgs('path');

    return query
      .on(doc)
      .then(_ => expDoc.verify());
  });

  it('Returns the correct value when executed', () => {
    let query = Query.factory.base('path');
    sinon.stub(doc, 'value').returns('value');

    return query
      .on(doc)
      .then(result => expect(result).to.equal('value'));
  });

  it('Formats the value', () => {
    let expFormat = sinon.mock().once().withArgs('value').returns('formatted');
    let query = Query.factory.base('path', {
      format: expFormat
    });

    sinon.stub(doc, 'value').returns('value');

    return query
      .on(doc)
      .then(result => expect(result).to.equal('formatted'))
      .then(_ => expFormat.verify());
  });

  it('Uses the default value if no value is found', () => {
    let query = Query.factory.base('path', {
      default: 'default'
    });

    sinon.stub(doc, 'value').returns(undefined);

    return query
      .on(doc)
      .then(result => expect(result).to.equal('default'));
  });

  it('Throws an error if the value is missing', () => {
    let query = Query.factory.base('path', {
      throwOnMissing: true
    });

    sinon.stub(doc, 'value').returns(undefined);

    return query
      .on(doc)
      .catch(result => expect(result).to.be.an.instanceof(Error));
  });

  it('Has methods for creating all query types', () => {
    let types = [
      'base',
      'follow',
      'regex',
      'string',
      'callback',
      'raw',
      'collection',
      'object',
      'number',
      'link',
      'context'
    ];

    for (let type of types) {
      expect(Query.factory[type]).to.be.a('function');
    }

    expect(Query.factory).to.be.a('function');
  });

  it('Returns a query if one is passed', () => {
    let query = Query.factory('path');

    expect(Query.factory(query)).to.equal(query);
  });

  it('Creates an object query given a plain object', () => {
    let objFactoryMock = sinon.mock(Query.factory);

    objFactoryMock.expects('object').once().withArgs({
      a: 'a'
    }).returns('object');

    expect(Query.factory({
      a: 'a'
    })).to.equal('object');

    objFactoryMock.verify();
    objFactoryMock.restore();
  });

  it('Creates a callback query if a function is passed', () => {
    let objFactoryMock = sinon.mock(Query.factory);

    let fn = () => 'a';

    objFactoryMock.expects('callback').once().withArgs(fn).returns('callback');

    expect(Query.factory(fn)).to.equal('callback');

    objFactoryMock.verify();
    objFactoryMock.restore();
  });

  it('Fallsback to the passed factory function if no type is guessed', () => {
    let mockFactory = sinon.mock();
    mockFactory.once().withArgs('a').returns('query');

    expect(Query.factory('a', mockFactory)).to.equal('query');

    mockFactory.verify();
  });



});


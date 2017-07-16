const helper = require('../helper');
const Query = require('../../src/query');
const Document = require('../../src/document');
const sandbox = sinon.sandbox.create();


describe('base query', () => {

  beforeEach(() => sandbox.verifyAndRestore());

  it('Queries the document for the selector', () => {
    let document = new Document();
    
    sandbox.mock(document).expects('value').once().withArgs('selector');

    let query = new Query('selector');

    return query.on(document);
  });

  it('Returns the correct value when executed', () => {
    let document = new Document();
    
    sandbox.stub(document, 'value').withArgs('selector').returns('value');

    let query = new Query('selector');

    return query.on(document)
      .then(result => expect(result).to.equal('value'));      
  });

  it('Formats the value with a single function', () => {
    let document = new Document();
    
    sandbox.stub(document, 'value').withArgs('selector').returns('value'); 

    let format = sandbox.mock().once().withArgs('value').returns('formatted');
    let query = new Query('selector',{
      format: format
    });

    return query.on(document)
      .then(result => expect(result).to.equal('formatted'));
  });

  it('Formats the value with multiple functions', () => {
    let document = new Document();
    
    sandbox.stub(document, 'value').withArgs('selector').returns('value'); 

    let format = [
      sandbox.mock().once().withArgs('value').returns('formattedOnce'),
      sandbox.mock().once().withArgs('formattedOnce').returns('formattedTwice')
    ];

    let query = new Query('selector',{
      format: format
    });

    return query.on(document)
      .then(result => expect(result).to.equal('formattedTwice'));
  });

  it('Uses the default value if no value is found', () => {
    let document = new Document();
    
    sandbox.stub(document, 'value').returns(undefined);

    let query = new Query('selector', {
      default: 'default'
    });

    return query.on(document)
      .then(result => expect(result).to.equal('default'));
  });

  it('Throws an error if the value is missing', () => {
    let document = new Document();
    
    sandbox.stub(document, 'value').returns(undefined);

    let query = new Query('selector', {
      throwOnMissing: true
    });

    return query.on(document)
      .catch(result => expect(result).to.be.an.instanceof(Error));
  });

  it('Has methods for creating all query types', () => {
    let types = [
      'follow',
      'regex',
      'string',
      'callback',
      'raw',
      'collection',
      'object',
      'number',
      'uri',
      'context'
    ];

    for (let type of types) {
      expect(Query.factory[type]).to.be.a('function');
    }

    expect(Query.factory).to.be.a('function');
  });

  it('Returns a query if one is passed', () => {
    let query = Query.factory('selector');
    expect(Query.factory(query)).to.equal(query);
  });

  it('Creates an object query given a plain object', () => {
    sandbox.mock(Query.factory).expects('object').once().withArgs({
      a: 'a'
    }).returns('objectQuery');

    expect(Query.factory({
      a: 'a'
    })).to.equal('objectQuery');
  });

  it('Creates a callback query if a function is passed', () => {
    let fn = () => 'a';
    
    sandbox.mock(Query.factory).expects('callback').once().withArgs(fn).returns('callbackQuery');
    
    expect(Query.factory(fn)).to.equal('callbackQuery');
  });

  it('Fallsback to the passed factory function if no type is guessed', () => {
    let factory = sandbox.mock();

    factory.once().withArgs('a').returns('query');

    expect(Query.factory('a', factory)).to.equal('query');
  });



});


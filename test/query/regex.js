const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../src/query');
const Document = require('../../src/document');
const sandbox = sinon.sandbox.create();


describe('regex query', () => {

  afterEach(() => sandbox.verifyAndRestore());

  it('Finds string in document', () => {
    let document = new Document();
    let query = Query.factory.regex('selector', /(.*)/, 1);

    sandbox.mock(document).expects('value').once().withArgs('selector').returns('value');

    return query.on(document);
  });

  it('Returns correct group from regex match', () => {
    let document = new Document();

    let queryOne = Query.factory.regex('selector', /(match)(me)/, 1);
    let queryTwo = Query.factory.regex('selector', /(match)(me)/, 2);

    sandbox.stub(document, 'value').returns('matchme');

    return queryOne.on(document)
      .then(result => expect(result).to.equal('match'))
      .then(_ => queryTwo.on(document))
      .then(result => expect(result).to.equal('me'));
  });

  it('Returns default when group not found', () => {
    let document = new Document();
    let query = Query.factory.regex('selector', /(match)(me)/, 3, {
      default: 'default'
    });

    sandbox.stub(document, 'value').returns('matchme');

    return query.on(document)
      .then(result => expect(result).to.equal('default'));
  });

  it('Returns default when group not matched', () => {
    let document = new Document();
    let query = Query.factory.regex('selector', /(match)(me)/, 1, {
      default: 'default'
    });

    sandbox.stub(document, 'value').returns('matchhim');

    return query.on(document)
      .then(result => expect(result).to.equal('default'));
  });

  it('Returns default if no value returned from document', () => {
    let document = new Document();
    let query = Query.factory.regex('selector', /(match)(me)/, 1, {
      default: 'default'
    });

    sandbox.stub(document, 'value').returns(undefined);

    return query.on(document)
      .then(result => expect(result).to.equal('default'));
  });

  it('Defaults to all groups if none are specified', () => {
    let document = new Document();
    let query = Query.factory.regex('selector', /(match)(me)/);

    sandbox.stub(document, 'value').returns('matchme');

    return query.on(document)
      .then(result => expect(result).to.eql(['matchme', 'match', 'me']));
  });

  

});


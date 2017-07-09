const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../query');
const Document = require('../../document');
const originalFactory = Query.factory;


describe('regex query', () => {

  let doc;

  beforeEach(() => {
    doc = new Document();
  });

  it('Finds string in document', () => {
    let query = Query.factory.regex('path', /(.*)/, 1);

    let expDoc = sinon.mock(doc).expects('value').once().withArgs('path').returns('value');

    return query
      .on(doc)
      .then(_ => expDoc.verify());
  });

  it('Returns correct group from regex match', () => {
    let query = Query.factory.regex('path', /(match)_(me)/, 1);

    sinon.stub(doc, 'value').returns('match_me');

    return query
      .on(doc)
      .then(result => expect(result).to.equal('match'))
      .then(query = Query.factory.regex('path', /(match)_(me)/, 2))
      .then(query
        .on(doc)
        .then(result => expect(result).to.equal('me'))
      ); 
  });

  it('Returns default / missing when group not found', () => {
    let query = Query.factory.regex('path', /(match)_(me)/, 1, {
      default: 'cool'
    });

    sinon.stub(doc, 'value').returns('not here');

    return query
      .on(doc)
      .then(result => expect(result).to.equal('cool'));
  });

});


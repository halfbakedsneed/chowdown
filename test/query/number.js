const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../query');
const Document = require('../../document');


describe('number query', () => {

  it('Returns a number when executed', () => {
    let doc = new Document();
    sinon.stub(doc, 'value').returns('3');

    Query.factory.number('path')
      .on(doc)
      .then(result => expect(result).to.equal(3))
  });

  
});


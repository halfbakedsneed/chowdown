const helper = require('../helper');
const { cloneDeep, assignIn } = require('lodash');
const Query = require('../../query');
const Document = require('../../document');


describe('raw query', () => {

  it('Queries the document with the function', () => {
    let doc = new Document();

    let expDoc = sinon.mock(doc).expects('raw').once().withArgs('fn').returns('result');

    return Query.factory.raw('fn')
      .on(doc)
      .then(_ => expDoc.verify())
  });

  
});


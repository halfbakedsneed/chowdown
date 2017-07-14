const chowdown = require('./chowdown');
const util = require('util');


let scope = chowdown.file('./test.html');

p = scope.collection('.author', {
    name: '.name',
    age: '.age',
    books: (author) => author.collection('.book', {
      title: '.title',
      year: '.year'
    })
  });

p = scope.raw(($, context) => $('.author:nth-child(2) .name').text());

p.tap((a) => console.log(util.inspect(a, false, null)));
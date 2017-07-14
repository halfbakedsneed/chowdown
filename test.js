const chowdown = require('./chowdown');
const util = require('util');
const fs = require('fs');
const Promise = require('bluebird');

let scope = chowdown.file('./test.html');

// p = scope.collection('.author', {
//     name: '.name',
//     age: '.age',
//     books: (author) => author.collection('.book', {
//       title: '.title',
//       year: '.year'
//     })
//   });

p = scope.follow(
  (doc) => doc.uri('.author:nth-child(1) .name'),
  (otherPage) => otherPage.string('#favourite-food'),
  {
    client: (r) => {
      return Promise.resolve(fs.readFileSync('test2.html', 'utf8'));
    }
  }
);

p.tap((a) => console.log(util.inspect(a, false, null)));
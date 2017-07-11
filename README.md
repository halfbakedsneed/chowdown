# elicit

Elicit is a JavaScript library intended to speed up the consumption
of HTML pages by allowing for it's quick transform into more usable formats.

## Installation

```shell
$ npm install elicitjs
```
## Basic Usage

Let's suppose there's a webpage, `http://somewebpage.com` with the following
markup:

```html
<div class="author">
  <span class="name">Dennis Reynolds</span>
  <span class="age">41</span>
  <img src="dennis.jpg"/>
  <div class="book">
    <span class="title">The Dennis System</span>
    <span class="year">2009</span>
  </div>
  <div class="book">
    <span class="title">Chardee MacDennis: A Guide</span>
    <span class="year">2011</span>
  </div>
</div>
<div class="author">
  <span class="name">Stephen King</span>
  <span class="age">69</span>
  <img src="stephen.jpg"/>
  <div class="book">
    <span class="title">Clown Town</span>
    <span class="year">1990</span>
  </div>
</div>
```

To quickly pull out the name and age of each author into an
array of objects, we can do the following:

```js
const elicit = require('elicitjs');

elicit('http://somewebpage.com')
  .collection('.author', {
    name: '.name',
    age: '.age'
  });
```

Output:

```js
[
  { name: 'Dennis Reynolds', age: '41'},
  { name: 'Stephen King', age: '69'},
]
```

### Attributes

Elicit is built on top of [cheerio](https://github.com/cheeriojs/cheerio) and hence it uses the familiar jQuery selector format. 
However, it's also possible to get an element's attribute by appending it's name to the end of a selector after a `/`.

This makes getting the `src` attribute of each author's image easy:

```js
elicit('http://somewebpage.com')
  .collection('.author', {
    name: '.name',
    age: '.age',
    image: 'img/src'
  });
```

Output:

```js
[
  { name: 'Dennis Reynolds', age: '41', image: 'dennis.jpg'},
  { name: 'Stephen King', age: '69', image: 'stephen.jpg'},
]
```

### Nesting

Using elicit, we can construct much more complex queries. By passing
a callback in place of a selector, we have the ability to customise and
nest queries.

Let's say we also want to retrieve each of the author's books:

```js
elicit('http://somewebpage.com')
  .collection('.author', {
    name: '.name',
    age: (author) => author.number('.age'),
    books: (author) => author.collection('.book', {
      title: '.title',
      year: (book) => book.number('.year')
    })
  });
```

Output:

```js
[
  { 
    name: 'Dennis Reynolds',
    age: 41,
    books: [
      {
        title: 'The Dennis System',
        year: 2009
      },
      {
        title: 'Chardee MacDennis: A Guide',
        year: 2011
      }
    ]
  },
  { 
    name: 'Stephen King',
    age: 69,
    books: [
      {
        title: 'Clown Town',
        year: 1990
      }
    ]
  },
]
```

Every callback is passed a [`Scope`](#scope) object (the same object that is returned from the main `elicit` function)
that has methods allowing for the execution of different queries relative to

## Document Retrieval

The library's main function has three functions hanging off of it which
allow for the creation of [`Scope`](#scope) objects in different ways:

### `elicit.request(request, [options])`

Issues a request using [`request-promise`](http://github.com/) with the given
request object or uri string.

#### Parameters
- `request` *`string|object`* Either a uri or a request object that will be passed to `request-promise`. 
- `[options]` *`object`* An object of configuration options.
  - `[client]` *`function`* A client function to use in place of `request-promise`. It will be passed
  a request object or uri and should return a promise that resolves to the body of a page.

#### Returns
- [*`Scope`*](#scope) A scope wrapping the response of the request.

### `elicit.file(file)`

Reads from the file located at the given filename.

#### Parameters
- `file` *`string`* The filename. 

#### Returns
- [*`Scope`*](#scope) A scope wrapping the file's contents.

### `elicit.body(body)`

Load a DOM document directly from a cheerio document or string.

#### Parameters
- `body` *`{cheerio|string}`* Either an existing cheerio document
or a DOM string. 

#### Returns
- [*`Scope`*](#scope) A scope wrapping the body.

## Scope







# chowdown

[![Build Status](https://travis-ci.org/halfbakedsneed/chowdown.svg?branch=master)](https://travis-ci.org/halfbakedsneed/chowdown)
[![Dependencies](https://david-dm.org/halfbakedsneed/chowdown.svg)](https://david-dm.org/halfbakedsneed/chowdown)
[![Coverage](https://coveralls.io/repos/github/halfbakedsneed/chowdown/badge.svg?branch=master)](https://coveralls.io/github/halfbakedsneed/chowdown?branch=master)

A JavaScript library that allows for the quick transformation of DOM documents into useful formats.

## <a name="table-of-contents"></a> Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
  - [Attributes](#attributes)
  - [Nesting](#nesting)
  - [Querying](#querying)
- [Creating Scopes](#creating-scopes)
  - [chowdown.request](#request)
  - [chowdown.file](#file)
  - [chowdown.body](#body)
- [Using Scopes](#using-scopes)
  - [scope.execute](#execute)
- [Creating Queries](#creating-queries)
  - [chowdown.query.string](#string)
  - [chowdown.query.number](#number)
  - [chowdown.query.collection](#collection)
  - [chowdown.query.object](#object)
  - [chowdown.query.raw](#raw)
  - [chowdown.query.regex](#regex)
  - [chowdown.query.context](#context)
  - [chowdown.query.uri](#uri)
  - [chowdown.query.follow](#follow)
  - [chowdown.query.paginate](#paginate)
  - [chowdown.query.callback](#callback)

## <a name="installation"></a> Installation

```shell
$ npm install chowdown
```
## <a name="basic-usage"></a> Basic Usage

Let's suppose there's a webpage, `http://somewebpage.com` with the following
markup:

<a name="sample-markup"></a>

```html
<div>
  <div class="author">
    <a href="/dennis" class="name">Dennis Reynolds</a>
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
    <a href="/stephen" class="name">Stephen King</a>
    <span class="age">69</span>
    <img src="stephen.jpg"/>
    <div class="book">
      <span class="title">Clown Town</span>
      <span class="year">1990</span>
    </div>
  </div>
  <a class="next" href="/search?page=2"/>
</div>
```

To quickly pull out the name and age of each author into an
array of objects, we can do the following:

```js
const chowdown = require('chowdown');

// Returns a promise
chowdown('http://somewebpage.com')
  .collection('.author', {
    name: '.name',
    age: '.age'
  });
```

This will resolve to:

```js
[
  { name: 'Dennis Reynolds', age: '41'},
  { name: 'Stephen King', age: '69'}
]
```

When executed, all chowdown queries return an instance of a [bluebird](https://github.com/petkaantonov/bluebird) Promise.

### <a name="attributes"></a> Attributes

Chowdown is built on top of [cheerio](https://github.com/cheeriojs/cheerio) and hence it uses the familiar jQuery selector format. 
However, chowdown's selectors also make it possible to get a DOM element's attribute by appending the attribute's name to the end of a selector (following a `/`).

This makes getting the `src` attribute of each author's image easy:

```js
chowdown('http://somewebpage.com')
  .collection('.author', {
    name: '.name',
    age: '.age',
    image: 'img/src'
  });
```

This will resolve to:

```js
[
  { name: 'Dennis Reynolds', age: '41', image: 'dennis.jpg'},
  { name: 'Stephen King', age: '69', image: 'stephen.jpg'}
]
```

If no attribute is specified in the selector for simple types of queries (i.e `string` or `number` queries), then chowdown will automatically grab an element's inner text.

### <a name="nesting"></a> Nesting

Using chowdown, we can construct much more complex queries. It's possible
to [construct queries](#creating-queries) for use inside of other queries.

If we wanted to retrieve each of the author's books, we could do the following:

```js
chowdown('http://somewebpage.com')
  .collection('.author', {
    name: '.name',
    age: '.age',
    books: chowdown.query.collection('.book', {
      title: '.title',
      year: '.year'
    })
  });

// or, alternatively:

chowdown('http://somewebpage.com')
  .collection('.author', {
    name: '.name',
    age: '.age',
    books: (author) => author.collection('.book', {
      title: '.title',
      year: '.year'
    })
  });
```

These will both resolve to:

```js
[
  { 
    name: 'Dennis Reynolds',
    age: '41',
    books: [
      {
        title: 'The Dennis System',
        year: '2009'
      },
      {
        title: 'Chardee MacDennis: A Guide',
        year: '2011'
      }
    ]
  },
  { 
    name: 'Stephen King',
    age: '69',
    books: [
      {
        title: 'Clown Town',
        year: '1990'
      }
    ]
  }
]
```

### <a name="querying"></a> Querying

As seen above, it's possible to take shortcuts to describe queries. Anywhere a
string is found in place of a query, it will be used as the `selector` parameter in a [string query](#string):

```js
let scope = chowdown('http://somewebpage.com');

scope.collection('.author', '.name')
// => Resolves to: ['Dennis Reynolds', 'Stephen King']

scope.collection('.author', chowdown.query.string('.name'))
// => Resolves to: ['Dennis Reynolds', 'Stephen King']
```

Likewise, anywhere an object is found in place of a query, it will be used as the `pick`
parameter in an [object query](#object).

```js
let scope = chowdown('http://somewebpage.com');

scope.collection('.author', {name: '.name'})
// => Resolves to: [{name: 'Dennis Reynolds'}, {name: 'Stephen King'}]

scope.collection('.author', chowdown.query.object({name: '.name'}))
// => Resolves to: [{name: 'Dennis Reynolds'}, {name: 'Stephen King'}]
```

Finally, anywhere a function is found in place of a query, it will be used as the `fn`
parameter in a [callback query](#callback).

```js
let scope = chowdown('http://somewebpage.com');

scope.collection('.author', (author) => author.string('.name'))
// => Resolves to: ['Dennis Reynolds', 'Stephen King']

scope.collection('.author', chowdown.query.callback((author) => author.string('.name')))
// => Resolves to: ['Dennis Reynolds', 'Stephen King']
```

Manually [created queries](#creating-queries) can also be executed directly on a [`Scope`](#using-scopes) like this:

```js
let scope = chowdown('http://somewebpage.com');

scope.execute(chowdown.query.string('.author:nth-child(1) .name'))
// => Resolves to: 'Dennis Reynolds'
```

## <a name="creating-scopes"></a> Creating Scopes

The library's main function is actually an alias for `chowdown.request`; this is one of three functions that
allow for the creation of [`Scope`](#using-scopes) objects:

### <a name="request"></a> chowdown.request(request, [options])
----

Issues a request using [`request-promise`](https://github.com/request/request-promise) with the given
request object or uri string and returns a [`Scope`](#using-scopes) created from the response.

#### Parameters
- `request` `{string|object}` Either a uri or a request object that will be passed to `request-promise`. 
- `[options]` `{object}` An object of configuration options.
  - `[client=rp]` `{function}` A client function to use in place of `request-promise`. It will be passed
  a request object or uri and should return a promise that resolves to a `string` or `cheerio` object.

#### Returns
- [`Scope`](#using-scopes) A scope wrapping the response of the request.

### <a name="file"></a> chowdown.file(file)
----

Reads from the file located at `file` and returns a [`Scope`](#using-scopes)
created from the contents of the file.

#### Parameters
- `file` `{string}` The filename. 

#### Returns
- [`Scope`](#using-scopes) A scope wrapping the file's contents.

### <a name="body"></a> chowdown.body(body)
----

Load a DOM document directly from a cheerio object or string and returns
a [`Scope`](#using-scopes) created from this document.

#### Parameters
- `body` `{cheerio|string}` Either an existing cheerio object
or a DOM string. 

#### Returns
- [`Scope`](#using-scopes) A scope wrapping the body.

## <a name="using-scopes"></a> Using Scopes

Scope instances have methods that allow you to query directly on a document (or part of a document):

- scope.string: creates and executes a [string query](#string) within the scope.
- scope.number: creates and executes a [number query](#number) within the scope.
- scope.collection: creates and executes a [collection query](#collection) within the scope.
- scope.object: creates and executes a [object query](#object) within the scope.
- scope.raw: creates and executes a [raw query](#raw) within the scope.
- scope.regex: creates and executes a [regex query](#regex) within the scope.
- scope.context: creates and executes a [context query](#context) within the scope.
- scope.uri: creates and executes a [uri query](#uri) within the scope.
- scope.follow: creates and executes a [follow query](#follow) within the scope.
- scope.paginate: creates and executes a [paginate query](#paginate) within the scope.
- scope.callback: creates and executes a [callback query](#callback) within the scope.
- [scope.execute](#execute)

### <a name="execute"></a> scope.execute(query)
----

Executes the given `query` on the document used by this scope.

#### Parameters
- `query` `{Query<T>}` The query to execute within this scope.

#### Returns
- `Promise<T>` A promise resolving to the result of the query.

#### Example

```js
let scope = chowdown.request('http://somewebpage.com');

let query = chowdown.query.string('.author:nth-child(1) .name');

scope.execute(query);
```

This will resolve to:

```js
'Dennis Reynolds'
```

## <a name="creating-queries"></a> Creating Queries

The main `chowdown` function has a `query` property containing methods that allow
for the creation of different types of queries:

- [chowdown.query.string](#string)
- [chowdown.query.number](#number)
- [chowdown.query.collection](#collection)
- [chowdown.query.object](#object)
- [chowdown.query.raw](#raw)
- [chowdown.query.regex](#regex)
- [chowdown.query.context](#context)
- [chowdown.query.uri](#uri)
- [chowdown.query.follow](#follow)
- [chowdown.query.callback](#callback)
- [chowdown.query.paginate](#paginate)

__All of the following examples use the same sample uri and markup as [before](#sample-markup).__

### <a name="string"></a> chowdown.query.string(selector, [options])
----

Creates a query to find a `string` at the given `selector` in a document.
Any retrieved non-string value will be coerced into a `string`.

#### Parameters
- `selector` `{string}` A selector to find the string in a document.
- `[options]` `{object}` An object of configuration options.
  - `[default='']` `{string}` The default value to return if no string is found.
  - `[throwOnMissing=false]` `{boolean}` A flag that dictates whether or not to throw an error if no string is found.
  - `[format=[]]` `{function|function[]}` A function or array of functions used to format the retrieved string.

#### Returns
- `Query<string>` The constructed string query.

#### Example

```js
let scope = chowdown('http://somewebpage.com');

let query = chowdown.query.string('.author:nth-child(1) .name');

scope.execute(query);
```

This will resolve to:

```js
'Dennis Reynolds'
```

### <a name="number"></a> chowdown.query.number(selector, [options])
----

Creates a query to find a `number` at the given `selector` in a document.
Any retrieved non-number value will be coerced into a `number`.

#### Parameters
- `selector` `{string}` A selector to find the number in a document.
- `[options]` `{object}` An object of configuration options.
  - `[default=NaN]` `{number}` The default value to return if no number is found.
  - See [chowdown.query.string](#string) for other possible options.

#### Returns
- `Query<number>` The constructed number query.

#### Example

```js
let scope = chowdown('http://somewebpage.com');

let query = chowdown.query.number('.author:nth-child(1) .age');

scope.execute(query);
```

This will resolve to:

```js
41
```

### <a name="collection"></a> chowdown.query.collection(selector, inner, [options])
-----

Creates a query to find an `array` of values such that each value in the array is the result of the `inner` query
executed on a child document. The set of child documents is pointed to by the `selector` parameter.

#### Parameters
- `selector` `{string}` A selector to find the child documents in a document.
- `inner` `{Query<T>}` The inner query to execute on each child document.
- `[options]` `{object}` An object of configuration options.
  - `[default=[]]` `{any[]}` The default value to return if no child documents are found.
  - `[filter]` `{function}` A function used to filter the resulting array. Every item in the array
  is passed through this function and the values for which the function is truthy are kept.
  - See [chowdown.query.string](#string) for other possible options.

#### Returns
- `Query<T[]>` The constructed collection query.

#### Example

```js
let scope = chowdown('http://somewebpage.com');

let query = chowdown.query.collection('.author', chowdown.query.number('.age'));

scope.execute(query);
```

This will resolve to:

```js
[41, 69]
```

### <a name="object"></a> chowdown.query.object(pick, [options])
----

Creates a query that will find an object in a document such that each value in the object is the result of the corresponding query in the `pick` parameter.

#### Parameters
- `pick` `{object}` The object of queries to map.
- `[options]` `{object}` An object of configuration options.
  - See [chowdown.query.string](#string) for possible options.

#### Returns
- `Query<object>` The constructed object query.

#### Example

```js
let scope = chowdown('http://somewebpage.com');

let query = chowdown.query.object({
  name: chowdown.query.string('.author:nth-child(1) .name'),
  age: chowdown.query.number('.author:nth-child(1) .age')
});

scope.execute(query);
```

This will resolve to:

```js
{
  name: 'Dennis Reynolds',
  age: 41
}
```

### <a name="raw"></a> chowdown.query.raw(fn, [options])
----

Creates a query that calls `fn` with the underlying cheerio function
and cheerio context. The result of this query will be the result of this call.

#### Parameters
- `fn` `{function}` The raw function to be called with the cheerio instance.
- `[options]` `{object}` An object of configuration options.
  - `[default=undefined]` `{any}` The default value to return if undefined is returned from the function.
  - See [chowdown.query.string](#string) for other possible options.

#### Returns
- `Query<any>` A promise that resolves to the result of the raw function.

#### Example

```js
let scope = chowdown('http://somewebpage.com');

let query = chowdown.query.raw(($, context) => $('.author:nth-child(2) .name').text());

scope.execute(query);
```

This will resolve to:

```js
'Stephen King'
```

### <a name="regex"></a> chowdown.query.regex(selector, pattern, [group], [options])
----

Creates a query that will find a `string` in a document using the given `selector` and 
perform a regex match on it using `pattern`.

#### Parameters
- `selector` `{string}` A selector to find the string in a document.
- `pattern` `{RegExp}` The pattern used to match on the retrieved string.
- `[group]` `{number}` The index of a matched group to return.
- `[options]` `{object}` An object of configuration options.
  - `[default=[]]` `{any[]}` The default value to return if no matches are made.
  - See [chowdown.query.string](#string) for other possible options.

#### Returns
- `Query<string|string[]>` The constructed regex query.

#### Example

```js
let scope = chowdown('http://somewebpage.com');

let query = chowdown.query.regex('.author:nth-child(2)', /(Stephen) (.*)/);

scope.execute(query);
```

This will resolve to (roughly):

```js
['Stephen King', 'Stephen', 'King']
```

If we want a specific group:

```js
let scope = chowdown('http://somewebpage.com');

let query = chowdown.query.regex('.author:nth-child(2)', /(Stephen) (.*)/, 2);

scope.execute(query);
```

This will resolve to:

```js
'King'
```

### <a name="context"></a> chowdown.query.context(selector, inner, [options])
----

Creates a query that executes the `inner` query within the context of a child document pointed to by the given `selector`.

#### Parameters
- `selector` `{string}` A selector to find the child document.
- `inner` `{Query<T>}` The inner query to execute on the child document.
- `[options]` `{object}` An object of configuration options.
  - `[default=undefined]` `{any}` The default value to return if the context can't be found.
  - See [chowdown.query.string](#string) for other possible options.

#### Returns
- `Query<T>` The constructed context query.

#### Example

```js
let scope = chowdown('http://somewebpage.com');

let query = chowdown.query.context('.author:nth-child(1) .book:nth-of-type(1)',
  chowdown.query.object({
    title: '.title',
    year: (book) => book.number('.year')
  })
);

scope.execute(query);
```

This will resolve to:

```js
{
  title: 'The Dennis System',
  year: 2009
}
```

### <a name="uri"></a> chowdown.query.uri(selector, [base], [options])
----

Creates a query that finds a URI in a document using the given `selector` and 
resolves it relative to the given `base` URI. Will automatically attempt to grab the `href` attribute of the
element specified by `selector`.

If no URI is retrieved from the document, chowdown will not attempt to resolve the default value agsint the `base` URI.

#### Parameters
- `selector` `{string}` A selector to find the URI.
- `[base]` `{string}` The base URI for the retrieved URI.
- `[options]` `{object}` An object of configuration options.
  - See [chowdown.query.string](#string) for possible options.

#### Returns
- `Query<string>` The constructed URI query.

#### Example

```js
let scope = chowdown('http://somewebpage.com');

let query = chowdown.query.uri('.author:nth-child(1) .name', 'http://somewebpage.com');

scope.execute(query);
```

This will resolve to:

```js
'http://somewebpage.com/dennis'
```

### <a name="follow"></a> chowdown.query.follow(uri, inner, [options])
----

Creates a query that follows the URI pointed to by the `uri` query and executes the `inner` query
on the document at this URI.

#### Parameters
- `uri` `{string|object|function}` A query to find the URI.
- `inner` `{Query<T>}` A query to execute on the document at the URI.
- `[options]` `{object}` An object of configuration options.
  - `[default=undefined]` `{any}` The default value to return if there's an error accessing the page.
  - `[client=rp]` `{function}` A client function to use in place of `request-promise`. It will be passed
  a request object or URI and should return a promise that resolves to a `string` or `cheerio` object.
  - `[request]` `{object}` An object of other request options to pass to `client`.
  - See [chowdown.query.string](#string) for other possible options.

#### Returns
- `Query<T>` The constructed follow query.

#### Example

In the [sample markup](#sample-markup) (for the uri `http://somewebpage.com`), we can see the first author's `div` contains a link to `http://somewebpage.com/dennis`.
Let's assume the markup at this uri is as follows:

```html
<a id="favourite-food">DeVitos</a>
```

We can use a follow query to read such important information like this:

```js
let scope = chowdown('http://somewebpage.com');

let query = chowdown.query.follow(
  (doc) => doc.uri('.author:nth-child(1) .name'),
  (otherPage) => otherPage.string('#favourite-food')
);

scope.execute(query);
```

This will resolve to:

```js
'DeVitos'
```

### <a name="paginate"></a> chowdown.query.paginate(inner, uri, [max], [options])
----

Creates a query that executes the `inner` query on multiple pages. The link to
the next page is pointed to by the `uri` query. Pagination will stop after
`max` pages have been requested. If `max` is a function, pagination will stop whenever it
returns `false`.

#### Parameters
- `inner` `{Query<T>}` A query to execute on each document.
- `uri` `{string|object|function}` A query to find the next page's URI in each document.
- `[max=Infinity]` `{number|function}` The maximum number of pages to retrieve or a function that takes the current number of pages and the last page and returns false when it's desirable to stop.
- `[options]` `{object}` An object of configuration options.
  - `[default=undefined]` `{any}` The default value to return if there's an error accessing a page.
  - `[client=rp]` `{function}` A client function to use in place of `request-promise`. It will be passed
  a request object or URI and should return a promise that resolves to a `string` or `cheerio` object.
  - `[request]` `{object}` An object of other request options to pass to `client`.
  - `[merge=flatten]` `{function}` The function used to merge the paginated results. Takes one argument `pages` - an array of all page results. Uses `lodash.flatten` by default.
  - See [chowdown.query.string](#string) for other possible options.

#### Returns
- `Query<any>` The constructed paginate query.

#### Example

In the [sample markup](#sample-markup), there exists a link to the next page of results `http://somewebpage.com/search?page=2` at the bottom of the page.
Let's assume the markup at this page is as follows:

```html
<div>
  <div class="author">
    <a href="/william" class="name">William Shakespeare</a>
    <span class="age">453</span>
    <img src="william.jpg"/>
    <div class="book">
      <span class="title">Hamlet</span>
      <span class="year">1600</span>
    </div>
  </div>
  <a class="next" href="/search?page=3"/>
</div>
```

We can execute queries on both the first page and this page (and as many more as we'd like) with the following query:

```js
let scope = chowdown('http://somewebpage.com');

let names = chowdown.query.collection('.author', '.name');

// The last argument is the maximum number of pages to read.
let pages = chowdown.query.paginate(names, '.next', 2);

scope.execute(query);
```

This will resolve to:

```js
['Dennis Reynolds', 'Stephen King', 'William Shakespeare']
```

### <a name="callback"></a> chowdown.query.callback(fn, [options])
----

Creates a query that calls `fn` with a [`Scope`](#using-scopes) that wraps a document (or part of
a document) and returns the result of this call.

#### Parameters
- `fn` `{function}` A function to call with a [`Scope`](#using-scopes) for a document.
- `[options]` `{object}` An object of configuration options.
  - See [chowdown.query.string](#string) for possible options.

#### Returns
- `Query<any>` The constructed callback query.

#### Example

```js
let scope = chowdown('http://somewebpage.com');

let query = chowdown.query.callback((document) => document.string('.author:nth-child(2) .name'));

scope.execute(query);
```

This will resolve to:

```js
'Stephen King'
```

## <a name="testing"></a> Testing

If you have cloned this repository, it's possible to run the tests by executing
the following command from the root of the repository:

```shell
$ npm test
```

## <a name="License"></a> License (ISC)

See the [LICENSE file](LICENSE) for details.
